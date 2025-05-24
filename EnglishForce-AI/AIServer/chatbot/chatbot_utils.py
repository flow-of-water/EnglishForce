import numpy as np
import random
import pickle
import json
import os
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import TreebankWordTokenizer
from keras.models import load_model
from db_utils import query_db_for_info

lemmatizer = WordNetLemmatizer()
tokenizer = TreebankWordTokenizer()

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load the model and data files from the current directory
model = load_model(os.path.join(current_dir, "chatbot_model.h5"))
intents = json.loads(open(os.path.join(current_dir, "intents.json"), encoding="utf-8").read())
words = pickle.load(open(os.path.join(current_dir, "words.pkl"), "rb"))
classes = pickle.load(open(os.path.join(current_dir, "classes.pkl"), "rb"))

def clean_up_sentence(sentence):
    sentence_words = tokenizer.tokenize(sentence)
    return [lemmatizer.lemmatize(word.lower()) for word in sentence_words]

def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print("found in bag:", w)
    return np.array(bag)

def predict_class(sentence, model):
    p = bow(sentence, words, show_details=False)
    p = np.array([p])
    res = model.predict(p).flatten()
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return [{"intent": classes[r[0]], "probability": str(r[1])} for r in results]

def get_response(intents_list, intents_json):
    tag = intents_list[0]["intent"]
    for intent in intents_json["intents"]:
        if intent["tag"] == tag:
            return random.choice(intent["responses"])
    return "I couldn't find a suitable response."

def chatbot_response(user_input):
    intents_list = predict_class(user_input, model)
    if not intents_list:
        return "Sorry, I couldn't understand that."
    intent = intents_list[0]["intent"]
    print(intent)
    if intent.startswith("#"):
        return query_db_for_info(intent, user_input)
    return get_response(intents_list, intents)
