import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import nltk
from nltk.stem import WordNetLemmatizer
import pickle
import numpy as np
import json
from keras.models import load_model

# Import test dataset từ file testdata.py
from testdata import test_dataset

lemmatizer = WordNetLemmatizer()

# ==== Model 1 ====
model1 = load_model('chatbot_model.h5')
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class_model1(sentence):
    p = bow(sentence, words)
    p = np.array([p])
    res = model1.predict(p,verbose=0)[0]
    ERROR_THRESHOLD = 0.25
    results = [(i, r) for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    if results:
        return classes[results[0][0]]
    else:
        return None

# ==== Model 2 ====
model2 = load_model('chatbot_model_v2.h5')
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
encoder = pickle.load(open('label_encoder.pkl', 'rb'))

def predict_class_model2(sentence):
    sentence = sentence.lower()
    sentence_vector = vectorizer.transform([sentence]).toarray()
    res = model2.predict(sentence_vector)[0]
    ERROR_THRESHOLD = 0.25
    results = [(i, r) for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    if results:
        return encoder.inverse_transform([results[0][0]])[0]
    else:
        return None

# ==== Đánh giá ====
def evaluate_models(test_data):
    correct1 = 0
    correct2 = 0
    total = len(test_data)

    with open("error_log.txt", "w", encoding="utf-8") as error_log:
        for text, true_label in test_data:
            pred1 = predict_class_model1(text)
            pred2 = predict_class_model2(text)

            if pred1 == true_label:
                correct1 += 1
            if pred2 == true_label:
                correct2 += 1

            if not (pred1 == true_label and pred2 == true_label):
                print(f"Input: {text}")
                print(f" True: {true_label}")
                print(f" Model1 pred: {pred1}")
                print(f" Model2 pred: {pred2}")
                print("-----")
                error_log.write(f"Input: {text}\n")
                error_log.write(f" True: {true_label}\n")
                error_log.write(f" Model1 pred: {pred1}\n")
                error_log.write(f" Model2 pred: {pred2}\n")
                error_log.write("-----\n")

    acc1 = correct1 / total * 100
    acc2 = correct2 / total * 100
    print(f"Model 1 Accuracy: {acc1:.2f}%")
    print(f"Model 2 Accuracy: {acc2:.2f}%")

if __name__ == "__main__":
    evaluate_models(test_dataset)
