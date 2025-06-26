import nltk
from nltk.stem import WordNetLemmatizer
import json
import pickle
import numpy as np



lemmatizer = WordNetLemmatizer()
pattern="Kỳ thi [exam_name] tiếp theo khi nào?"
w = nltk.word_tokenize(pattern)
print(w)