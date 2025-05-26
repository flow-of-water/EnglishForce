import numpy as np
import pickle
import os
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Flatten, Dense, Concatenate
from tensorflow.keras.optimizers import Adam

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load dữ liệu huấn luyện
with open(os.path.join(current_dir, 'train_data.pkl'), 'rb') as f:
    X, y = pickle.load(f)

# Load các encoder để lấy số lượng lớp chính xác
with open(os.path.join(current_dir, 'user_encoder.pkl'), 'rb') as f:
    user_encoder = pickle.load(f)
with open(os.path.join(current_dir, 'course_encoder.pkl'), 'rb') as f:
    course_encoder = pickle.load(f)

# Số lượng người dùng và khóa học (dùng đúng encoder đã fit)
num_users = len(user_encoder.classes_)
num_courses = len(course_encoder.classes_)
course_feat_dim = X['course_features'].shape[1]
desc_feat_dim = X['desc_tfidf'].shape[1]

# Định nghĩa các input
user_input = Input(shape=(1,), name='user')
course_input = Input(shape=(1,), name='course')
user_score_input = Input(shape=(1,), name='user_score')
course_features_input = Input(shape=(course_feat_dim,), name='course_features')
desc_input = Input(shape=(desc_feat_dim,), name='desc_tfidf')

# Embedding
user_embedding = Embedding(input_dim=num_users, output_dim=32)(user_input)
course_embedding = Embedding(input_dim=num_courses, output_dim=32)(course_input)
user_vec = Flatten()(user_embedding)
course_vec = Flatten()(course_embedding)

# Gộp tất cả các đặc trưng
x = Concatenate()([user_vec, course_vec, user_score_input, course_features_input, desc_input])
x = Dense(128, activation='relu')(x)
x = Dense(64, activation='relu')(x)
output = Dense(1)(x)  # đầu ra là rating

# Tạo và compile model
model = Model(inputs=[user_input, course_input, user_score_input, course_features_input, desc_input], outputs=output)
model.compile(optimizer=Adam(1e-3), loss='mse', metrics=['mae'])

# Huấn luyện model
model.fit(
    [X['user'], X['course'], X['user_score'], X['course_features'], X['desc_tfidf']],
    y,
    batch_size=32,
    epochs=10,
    validation_split=0.1
)

# Lưu model
model.save(os.path.join(current_dir, 'recommend_model.h5'), include_optimizer=False)
