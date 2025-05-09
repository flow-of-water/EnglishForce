# fastapi dev main.py

from fastapi import FastAPI
from pydantic import BaseModel
import random
import json
import numpy as np
import pickle
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import TreebankWordTokenizer
from keras.models import load_model


# Ensure NLTK punkt is available
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# Init
app = FastAPI()
lemmatizer = WordNetLemmatizer()

# Load resources
model = load_model("chatbot_model.h5")
intents = json.loads(open("intents.json").read())
words = pickle.load(open("words.pkl", "rb"))
classes = pickle.load(open("classes.pkl", "rb"))

# Request schema
class Message(BaseModel):
    msg: str

# Helper functions
def clean_up_sentence(sentence):
    tokenizer = TreebankWordTokenizer()
    sentence_words = tokenizer.tokenize(sentence)
    return [lemmatizer.lemmatize(word.lower()) for word in sentence_words]

def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    p = bow(sentence, words)
    p = np.array([p])
    res = model.predict(p)[0]

    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)

    return [{"intent": classes[r[0]], "probability": str(r[1])} for r in results]

def get_response(ints, intents_json):
    if not ints:
        return "Sorry, I didn't understand that."

    tag = ints[0]['intent']
    for i in intents_json["intents"]:
        if i["tag"] == tag:
            return random.choice(i["responses"])

# API endpoint
@app.post("/chat")
def chat(message: Message):
    ints = predict_class(message.msg)
    response = get_response(ints, intents)
    return {"response": response}
