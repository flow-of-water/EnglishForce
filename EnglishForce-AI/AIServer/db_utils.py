import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv('DB_USER')
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = os.getenv('DB_PORT')

def get_db_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )


def extract_name(user_input):
    # Tìm dấu ":" gần nhất và lấy phần sau dấu ":"
    if ':' in user_input:
        course_name = user_input.split(':', 1)[1].strip()  # Lấy phần sau dấu ":" (chỉ cắt 1 lần)
        return course_name

    # Fallback nếu không match được
    return user_input.split()[-1]

def query_db_for_info(intent, user_input, userId=""):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        if intent in ["#en_course_recommendation", "#vi_course_recommendation"]:
            cur.execute("""
        SELECT c.name, c.description, c.instructor, COALESCE(AVG(uc.rating), 0) AS avg_rating
        FROM courses c
        LEFT JOIN user_courses uc ON c.id = uc.course_id
        GROUP BY c.id, c.name, c.description, c.instructor
        ORDER BY avg_rating DESC
        LIMIT 5
    """)
            results = cur.fetchall()
            if not results:
                return "No courses found."
            response = ""
            if intent =="#en_course_recommendation":
                response = "Here are some recommended courses for you.\n"
            else :
                response = "Dưới đây là một số khóa học được gợi ý cho bạn.\n"

            for result in results:
                if intent == "#en_course_recommendation":
                    response += f"Course: {result[0]}, Description: {result[1]}, Instructor: {result[2]}.\n"
                else:
                    response += f"Khóa học: {result[0]}, Mô tả: {result[1]}, Người hướng dẫn: {result[2]}.\n"
            return response

        elif intent in ["#en_course_info", "#vi_course_info"]:
            course_name = extract_name(user_input)
            cur.execute("SELECT name, description, instructor FROM courses WHERE name ILIKE %s", (course_name,))
            result = cur.fetchone()
            if not result:
                return "No courses found."
            return (
                f"Course: {result[0]}, \nDescription: {result[1]}, \ninstructor: {result[2]}"
                if intent == "#en_course_info"
                else f"Khóa học: {result[0]}, \nMô tả: {result[1]}, \nngười hướng dẫn: {result[2]}"
            )

        elif intent in ["#en_exam_info", "#vi_exam_info"]:
            exam_name = extract_name(user_input)
            cur.execute("SELECT name, description FROM exams WHERE name ILIKE %s", (exam_name,))
            result = cur.fetchone()
            if not result:
                return "No exams found."
            return (
                f"Exam: {result[0]}, description: {result[1]}"
                if intent == "#en_exam_info"
                else f"Bài kiểm tra: {result[0]}, mô tả: {result[1]}"
            )

        elif intent in ["#en_user_info", "#vi_user_info"]:
            if not userId or userId == "" :
                return "No users found."
            cur.execute("SELECT username, email FROM users WHERE id = %s", (userId,))
            result = cur.fetchone()
            if not result:
                return "No users found."
            return (
                f"User: {result[0]}, email: {result[1]}"
                if intent == "#en_user_info"
                else f"Người dùng: {result[0]}, email: {result[1]}"
            )
        elif intent in ["#vi_learning_progress", "#en_learning_progress"]:
            if not userId or userId == "" :
                return "No users found."
            # Lấy user id
            cur.execute("SELECT id FROM users WHERE id = %s", (userId,))
            user_row = cur.fetchone()
            if not user_row:
                return "Không tìm thấy người dùng." if intent == "#vi_learning_progress" else "No users found."
            user_id = user_row[0]

            # Query tiến độ học tập: liên kết user_progresses - lessons - programs
            cur.execute("""
                SELECT l.name AS lesson_name, p.name AS program_name, up.score, up.completed_at
                FROM user_progresses up
                LEFT JOIN lessons l ON up.lesson_id = l.id
                LEFT JOIN programs p ON up.program_id = p.id
                WHERE up.user_id = %s
                ORDER BY up.completed_at DESC NULLS LAST
                LIMIT 20
            """, (user_id,))

            progresses = cur.fetchall()
            if not progresses:
                return ("Người dùng chưa có tiến độ học tập nào." if intent == "#vi_learning_progress"
                        else "User has no learning progress yet.")

            lines = []
            for lesson_name, program_name, score, completed_at in progresses:
                lesson_name = lesson_name or "Bài học chưa rõ" if intent == "#vi_learning_progress" else "Unknown Lesson"
                program_name = program_name or "Chương trình chưa rõ" if intent == "#vi_learning_progress" else "Unknown Program"
                score_str = str(score) if score is not None else "N/A"
                if completed_at:
                    completed_str = completed_at.strftime("%d-%m-%Y") if intent == "#vi_learning_progress" else completed_at.strftime("%Y-%m-%d")
                else:
                    completed_str = "Chưa hoàn thành" if intent == "#vi_learning_progress" else "Not completed"

                if intent == "#vi_learning_progress":
                    line = f"Bài học: {lesson_name} ({program_name}), Điểm: {score_str}, Hoàn thành: {completed_str}"
                else:
                    line = f"Lesson: {lesson_name} ({program_name}), Score: {score_str}, Completed: {completed_str}"
                lines.append(line)

            return "\n".join(lines)
        return "I couldn't find the information you're looking for."
    finally:
        cur.close()
        conn.close()
