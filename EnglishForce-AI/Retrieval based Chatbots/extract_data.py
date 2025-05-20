import pandas as pd
from sqlalchemy import create_engine

# Thông tin kết nối đến PostgreSQL
DB_USER = 'postgres'
DB_HOST = 'localhost'
DB_NAME = 'englishforce'
DB_PORT = 5432

# Tạo engine SQLAlchemy
engine = create_engine(f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

# 1. USERS: user_id, average_score_in_exams
users_query = """
SELECT 
    u.id AS user_id,
    ROUND(AVG(ea.score)::numeric, 2) AS average_score_in_exams
FROM users u
LEFT JOIN exam_attempts ea ON u.id = ea.user_id
GROUP BY u.id
"""
users_df = pd.read_sql(users_query, engine)
users_df.to_csv('users.csv', index=False)

# 2. COURSES: course_id, name, description, price, average_rating, number_of_enrollments, number_of_rating
courses_query = """
SELECT 
    c.id AS course_id,
    c.name,
    c.description,
    c.price::float,
    ROUND(AVG(uc.rating)::numeric, 2) AS average_rating,
    COUNT(DISTINCT uc.user_id) AS number_of_enrollments,
    COUNT(uc.rating) AS number_of_rating
FROM courses c
LEFT JOIN user_courses uc ON c.id = uc.course_id
GROUP BY c.id
"""
courses_df = pd.read_sql(courses_query, engine)
courses_df.to_csv('courses.csv', index=False)

# 3. RATINGS: user_id, course_id, rating
ratings_query = """
SELECT 
    u.id AS user_id,
    c.id AS course_id,
    uc.rating::float AS rating
FROM user_courses uc
JOIN users u ON uc.user_id = u.id
JOIN courses c ON uc.course_id = c.id
WHERE uc.rating IS NOT NULL
"""
ratings_df = pd.read_sql(ratings_query, engine)
ratings_df.to_csv('ratings.csv', index=False)

print("✅ Export xong 3 file: users.csv, courses.csv, ratings.csv")
