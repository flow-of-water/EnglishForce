import pickle
import numpy as np
import json
from keras.models import load_model
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import nltk
from nltk.stem import WordNetLemmatizer

# Load mô hình
model_v1 = load_model("chatbot_model.h5")
model_v2 = load_model("chatbot_model_v2.h5")

# Load từ vựng và label
words = pickle.load(open("words.pkl", "rb"))
classes = pickle.load(open("classes.pkl", "rb"))

vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
label_encoder = pickle.load(open("label_encoder.pkl", "rb"))

lemmatizer = WordNetLemmatizer()

# Load test data
from testdata import test_dataset

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_model_v1(sentence):
    p = bow(sentence)
    res = model_v1.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    if not results:
        return None
    results.sort(key=lambda x: x[1], reverse=True)
    return classes[results[0][0]]

def predict_model_v2(sentence):
    vec = vectorizer.transform([sentence]).toarray()
    res = model_v2.predict(vec)[0]
    pred_index = np.argmax(res)
    return label_encoder.inverse_transform([pred_index])[0]

# Đánh giá độ chính xác
def evaluate_model(predict_func):
    correct = 0
    total = len(test_dataset)
    for sentence, expected_label in test_dataset:
        pred_label = predict_func(sentence)
        if pred_label == expected_label:
            correct += 1
    return correct / total

acc_v1 = evaluate_model(predict_model_v1)
acc_v2 = evaluate_model(predict_model_v2)

print(f"🎯 Độ chính xác chatbot_model.h5 (BoW): {acc_v1:.2%}")
print(f"🎯 Độ chính xác chatbot_model_v2.h5 (TF-IDF): {acc_v2:.2%}")
