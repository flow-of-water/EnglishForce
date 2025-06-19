import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pickle
import os

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load dữ liệu
users = pd.read_csv(os.path.join(current_dir, 'users.csv'))
courses = pd.read_csv(os.path.join(current_dir, 'courses.csv'))
ratings = pd.read_csv(os.path.join(current_dir, 'ratings.csv'))

# Merge dữ liệu chính để huấn luyện
data = ratings.merge(users, on='user_id').merge(courses, on='course_id')

# Encode user_id và course_id
user_encoder = LabelEncoder()
course_encoder = LabelEncoder()
user_encoder.fit(users['user_id'])                   # encode tất cả user trong hệ thống
course_encoder.fit(courses['course_id'])             # encode tất cả khóa học trong hệ thống

data['user_encoded'] = user_encoder.transform(data['user_id'])
data['course_encoded'] = course_encoder.transform(data['course_id'])

# Scale các đặc trưng số
scaler = MinMaxScaler()
data[['average_score_in_exams', 'price', 'average_rating', 'number_of_enrollments', 'number_of_rating']] = \
    scaler.fit_transform(data[['average_score_in_exams', 'price', 'average_rating', 'number_of_enrollments', 'number_of_rating']])

# TF-IDF cho description
tfidf = TfidfVectorizer(max_features=100)
desc_tfidf = np.asarray(tfidf.fit_transform(data['description'].fillna('')).toarray())

# Lưu các encoder và vectorizer
with open(os.path.join(current_dir, 'user_encoder.pkl'), 'wb') as f: pickle.dump(user_encoder, f)
with open(os.path.join(current_dir, 'course_encoder.pkl'), 'wb') as f: pickle.dump(course_encoder, f)
with open(os.path.join(current_dir, 'scaler.pkl'), 'wb') as f: pickle.dump(scaler, f)
with open(os.path.join(current_dir, 'tfidf.pkl'), 'wb') as f: pickle.dump(tfidf, f)

# Tạo đầu vào và đầu ra cho model
X = {
    'user': data['user_encoded'].values,
    'course': data['course_encoded'].values,
    'user_score': data['average_score_in_exams'].values,
    'course_features': data[['price', 'average_rating', 'number_of_enrollments', 'number_of_rating']].values,
    'desc_tfidf': desc_tfidf
}
y = data['rating'].values

# Lưu dữ liệu huấn luyện
with open(os.path.join(current_dir, 'train_data.pkl'), 'wb') as f:
    pickle.dump((X, y), f)
