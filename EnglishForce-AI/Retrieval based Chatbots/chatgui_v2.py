import nltk
from nltk.stem import WordNetLemmatizer
import pickle
import numpy as np
import json
import random
import os
import sys

from keras.models import load_model
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

from tkinter import *

# Thêm đường dẫn để import từ thư mục AIserver
sys.path.append(os.path.abspath("../AIserver"))
from db_utils import query_db_for_info

# ==== Load mô hình và công cụ ====
model = load_model("chatbot_model_v2.h5")
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
encoder = pickle.load(open("label_encoder.pkl", "rb"))

with open("intents.json", encoding="utf-8") as file:
    intents = json.load(file)

lemmatizer = WordNetLemmatizer()

# ==== Hàm dự đoán intent ====
def predict_class(sentence, model):
    sentence = sentence.lower()
    sentence_vector = vectorizer.transform([sentence]).toarray()
    res = model.predict(sentence_vector)[0]

    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)

    return_list = []
    for r in results:
        intent = encoder.inverse_transform([r[0]])[0]
        return_list.append({"intent": intent, "probability": str(r[1])})
    return return_list

# ==== Trả về phản hồi từ intent ====
def getResponse(ints, intents_json):
    tag = ints[0]['intent']
    for i in intents_json['intents']:
        if i['tag'] == tag and i['responses']:
            return random.choice(i['responses'])
    return "Xin lỗi, tôi không có phản hồi cho yêu cầu này."

# ==== Hàm phản hồi chính ====
def chatbot_response(msg):
    ints = predict_class(msg, model)
    if not ints:
        return "Xin lỗi, tôi không hiểu ý bạn."

    intent = ints[0]['intent']

    # Nếu là intent đặc biệt cần truy vấn database
    if intent.startswith("#"):
        return query_db_for_info(intent, msg)

    return getResponse(ints, intents)

# ==== GUI đơn giản ====
def send():
    msg = EntryBox.get("1.0", 'end-1c').strip()
    EntryBox.delete("0.0", END)

    if msg != '':
        ChatLog.config(state=NORMAL)
        ChatLog.insert(END, "Bạn: " + msg + '\n\n')
        ChatLog.config(foreground="#442265", font=("Verdana", 12))

        res = chatbot_response(msg)
        ChatLog.insert(END, "Bot: " + res + '\n\n')

        ChatLog.config(state=DISABLED)
        ChatLog.yview(END)

base = Tk()
base.title("EnglishForce Chatbot (TF-IDF + DB)")
base.geometry("400x500")
base.resizable(width=False, height=False)

ChatLog = Text(base, bd=0, bg="white", height="8", width="50", font="Arial",)
ChatLog.config(state=DISABLED)

scrollbar = Scrollbar(base, command=ChatLog.yview, cursor="heart")
ChatLog['yscrollcommand'] = scrollbar.set

SendButton = Button(base, font=("Verdana", 12, 'bold'), text="Gửi", width="12", height=5,
                    bd=0, bg="#32de97", activebackground="#3c9d9b", fg='#ffffff', command=send)

EntryBox = Text(base, bd=0, bg="white", width="29", height="5", font="Arial")

scrollbar.place(x=376, y=6, height=386)
ChatLog.place(x=6, y=6, height=386, width=370)
EntryBox.place(x=128, y=401, height=90, width=265)
SendButton.place(x=6, y=401, height=90)

base.mainloop()
