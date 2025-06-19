import numpy as np
import pandas as pd
import pickle
from tensorflow.keras.models import load_model

# Load model và các preprocessing tools
model = load_model('recommend_model.h5')
with open('user_encoder.pkl', 'rb') as f: user_encoder = pickle.load(f)
with open('course_encoder.pkl', 'rb') as f: course_encoder = pickle.load(f)
with open('scaler.pkl', 'rb') as f: scaler = pickle.load(f)
with open('tfidf.pkl', 'rb') as f: tfidf = pickle.load(f)

# Load course metadata
courses_df = pd.read_csv('courses.csv')
users_df = pd.read_csv('users.csv')

def recommend_top_k_courses(user_id, k=5):
    user_id = int(user_id)
    if user_id not in user_encoder.classes_:
        raise ValueError("User ID not found. Bạn cần thêm user này vào hệ thống trước.")

    # Encode user
    user_encoded = user_encoder.transform([user_id])[0]

    # Lấy thông tin user
    user_info = users_df[users_df['user_id'] == user_id].iloc[0]
    user_score = scaler.transform([[user_info['average_score_in_exams'], 0, 0, 0, 0]])[0][0]  # chỉ lấy score

    # Chuẩn bị input cho từng course
    user_input = []
    course_input = []
    user_score_input = []
    course_features_input = []
    desc_tfidf_input = []

    for _, row in courses_df.iterrows():
        course_id = row['course_id']
        if course_id not in course_encoder.classes_:
            continue  # bỏ qua course lạ

        course_encoded = course_encoder.transform([course_id])[0]

        # scale features
        scaled = scaler.transform([[0, row['price'], row['average_rating'], row['number_of_enrollments'], row['number_of_rating']]])[0][1:]
        tfidf_vec = np.asarray(tfidf.transform([row['description'] if pd.notna(row['description']) else '']).toarray()[0])

        user_input.append(user_encoded)
        course_input.append(course_encoded)
        user_score_input.append(user_score)
        course_features_input.append(scaled)
        desc_tfidf_input.append(tfidf_vec)

    # Dự đoán
    predictions = model.predict([
        np.array(user_input),
        np.array(course_input),
        np.array(user_score_input),
        np.array(course_features_input),
        np.array(desc_tfidf_input)
    ])

    # Lấy top-k
    top_indices = predictions.flatten().argsort()[-k:][::-1]
    top_courses = courses_df.iloc[top_indices][['course_id', 'name', 'average_rating']]

    return top_courses.reset_index(drop=True)
top_courses = recommend_top_k_courses('2', k=2)
print(top_courses)




valid_course_count = 0
for _, row in courses_df.iterrows():
    if row['course_id'] in course_encoder.classes_:
        valid_course_count += 1
print(f"Số khóa học được encode hợp lệ: {valid_course_count}")