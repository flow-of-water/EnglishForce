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

def query_db_for_info(intent, user_input):
    conn = get_db_connection()
    cur = conn.cursor()

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
        username = extract_name(user_input)
        cur.execute("SELECT username, email FROM users WHERE username = %s", (username,))
        result = cur.fetchone()
        if not result:
            return "No users found."
        return (
            f"User: {result[0]}, email: {result[1]}"
            if intent == "#en_user_info"
            else f"Người dùng: {result[0]}, email: {result[1]}"
        )

    return "I couldn't find the information you're looking for."
