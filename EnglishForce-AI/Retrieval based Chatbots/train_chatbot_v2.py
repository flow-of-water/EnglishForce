# Dùng TF-IDF + Keras

import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import numpy as np
import random

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from keras.models import Sequential
from keras.layers import Dense, Dropout, Input
from keras.utils import to_categorical
from keras.optimizers import SGD

# Khởi tạo
lemmatizer = WordNetLemmatizer()

# Load intents
with open('intents.json', encoding='utf-8') as file:
    intents = json.load(file)

# Thu thập dữ liệu
corpus = []
labels = []

for intent in intents['intents']:
    for pattern in intent['patterns']:
        corpus.append(pattern)
        labels.append(intent['tag'])

print(f"{len(corpus)} training samples across {len(set(labels))} classes.")

# TF-IDF vectorization
vectorizer = TfidfVectorizer(tokenizer=nltk.word_tokenize, stop_words='english')
X = vectorizer.fit_transform(corpus).toarray()

# Encode nhãn thành số
encoder = LabelEncoder()
y = encoder.fit_transform(labels)
y = to_categorical(y)

# Shuffle dữ liệu
combined = list(zip(X, y))
random.shuffle(combined)
X, y = zip(*combined)
X = np.array(X)
y = np.array(y)

# Lưu lại vectorizer và encoder để dùng khi predict
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))
pickle.dump(encoder, open("label_encoder.pkl", "wb"))

# Tạo mô hình
model = Sequential()
model.add(Input(shape=(X.shape[1],)))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(y.shape[1], activation='softmax'))

# Compile mô hình
sgd = SGD(learning_rate=0.01, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# Huấn luyện
hist = model.fit(X, y, epochs=200, batch_size=5, verbose=1)

# Lưu model
model.save("chatbot_model.h5")
print("✅ Mô hình đã được huấn luyện và lưu lại thành chatbot_model.h5")
