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
"""

from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 2)

    @task(2)
    def load_exam_page(self):
        self.client.get("/exams/60bd41ad-3b9d-49a3-a392-172f34e97f7b/start")

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
