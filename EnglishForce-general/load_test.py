"""
📌 Mục đích:
Script này dùng để kiểm thử tải (Load Test) hệ thống EnglishForce bằng thư viện Locust.
Nó mô phỏng hành vi người dùng truy cập 3 API chính:
1. GET trang bắt đầu bài kiểm tra (Exam Start Page)
2. POST yêu cầu đến Chatbot AI
3. POST yêu cầu hệ thống gợi ý khóa học (Recommendation)

⚖️ Tần suất truy cập:
- API load_exam_page có tần suất gấp đôi (2x) so với hai API còn lại.
- Giả lập thời gian chờ giữa các lần request từ 1–2 giây để mô phỏng hành vi người dùng thật.

🎯 Mục tiêu:
- Đo hiệu năng từng API trong hệ thống.
- Phát hiện điểm nghẽn (bottleneck) khi có nhiều người dùng truy cập đồng thời.

Command: locust -f load_test.py --host http://localhost:5000
"""

from locust import HttpUser, task, between
import random
import string

class WebsiteUser(HttpUser):
    wait_time = between(1, 2)

    def on_start(self):
        """Gọi login API để lấy JWT token"""
        self.token = self.get_jwt_token()
        self.headers = { 
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def random_string(self, length=10):
        """Generate a random string of letters."""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


    def random_int(self, min_value=60, max_value=180):
        """Generate a random integer for duration."""
        return random.randint(min_value, max_value)

    def get_jwt_token(self):
        login_payload = {
            "username": "admin",
            "password": "Admin@123"
        }
        response = self.client.post("/api/auth/login", json=login_payload)
        
        # Kiểm tra mã trạng thái HTTP để chắc chắn đã đăng nhập thành công
        assert response.status_code == 200, f"Expected 200 OK, but got {response.status_code}"
        
        # Lấy token từ phản hồi và trả về
        data = response.json()
        token = data.get("accessToken")
        assert token, "Token not found in response"
        
        return token

    def create_exam(self):
        """Create a new exam and return its exam_id."""
        exam_name = f"New Exam {self.random_string()}"
        payload = {
            "name": exam_name,
            "description": f"This is a test exam with ID {self.random_string(5)}",
            "duration": self.random_int(),
            "type": random.choice(["general", "toeic"])
        }

        # Gửi yêu cầu POST để tạo bài thi
        response = self.client.post("/api/exams", json=payload, headers=self.headers)

        # Kiểm tra mã trạng thái HTTP
        assert response.status_code == 201, f"Expected 201 Created, but got {response.status_code}"

        data = response.json()
        exam_id = data["public_id"]
        return exam_id  # Trả về exam_id của bài thi vừa tạo


    @task(2)
    def load_exam_page(self):
        self.client.get("/api/exams/dc996173-7fa6-42aa-b03b-2dedbef811be")

    @task(1)
    def call_chatbot(self):
        payload = { "prompt": "Xin chào " }
        headers = { "Content-Type": "application/json" }
        self.client.post("/api/AI/chatbot", json=payload, headers=headers)

    @task(1)
    def call_recommend(self):
        payload = { "n_recommendations": 18 }
        headers = { "Content-Type": "application/json" }
        self.client.post("/api/AI/recommendations", json=payload, headers=headers)


    @task(1)
    def update_exam_and_check(self):
        exam_id = "095c1ee3-dcce-4db4-8a35-301cb095eb07"
        updated_payload = {
            "name": f"Updated Exam {self.random_string()}",
            "description": "This is an updated test exam.",
            "duration": self.random_int(),
            "type": random.choice(["general", "toeic"]) 
        }
        
        # Bước 1: Gửi yêu cầu PUT để cập nhật bài thi
        with self.client.put(
            f"/api/exams/{exam_id}", 
            json=updated_payload, 
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code != 200:
                response.failure(f"Update failed: Expected 200 OK, but got {response.status_code}")
                return
            response.success()
        
        # Bước 2: Gửi yêu cầu GET để lấy thông tin bài thi sau khi cập nhật
        with self.client.get(f"/api/exams/{exam_id}", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Get exam failed: Expected 200 OK, but got {response.status_code}")
                return
            
            # Kiểm tra dữ liệu trả về có chứa thông tin đã cập nhật
            data = response.json()
            errors = []
            
            if data.get("name") != updated_payload["name"]:
                errors.append(f"name: expected '{updated_payload['name']}', got '{data.get('name')}'")
            
            if data.get("description") != updated_payload["description"]:
                errors.append(f"description: expected '{updated_payload['description']}', got '{data.get('description')}'")
            
            if data.get("duration") != updated_payload["duration"]:
                errors.append(f"duration: expected {updated_payload['duration']}, got {data.get('duration')}")
            
            if errors:
                response.failure(f"Validation failed - {'; '.join(errors)}")
            else:
                response.success()


    @task(1)
    def delete_exam_and_check(self):
        """Delete an exam and check if it was removed correctly."""
        exam_id = self.create_exam()  # Tạo bài thi mới và lấy exam_id
        
        # Bước 1: Gửi yêu cầu DELETE để xóa bài thi
        with self.client.delete(
            f"/api/exams/{exam_id}", 
            headers=self.headers,
            catch_response=True
        ) as response:
            if response.status_code != 204:
                response.failure(f"Delete failed: Expected 204 No Content, but got {response.status_code}")
                return
            response.success()
        
        # Bước 2: Gửi yêu cầu GET để kiểm tra thông tin bài thi đã xóa
        with self.client.get(f"/api/exams/{exam_id}", catch_response=True) as response:
            if response.status_code != 404:
                response.failure(f"Exam still exists: Expected 404 Not Found, but got {response.status_code}")
                return
            response.success()
        
        # Bước 3: Gửi yêu cầu GET list để kiểm tra xem bài thi đã xóa không còn trong danh sách
        with self.client.get("/api/exams", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Get exam list failed: Expected 200 OK, but got {response.status_code}")
                return
            
            # Kiểm tra xem bài thi đã xóa không còn trong danh sách bài thi
            data = response.json()
            exam_ids = [exam["public_id"] for exam in data.get("exams", [])]
            
            if exam_id in exam_ids:
                response.failure(f"Deleted exam {exam_id} is still in the exam list")
            else:
                response.success()

