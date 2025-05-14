# fastapi dev main.py
from fastapi import FastAPI
from pydantic import BaseModel
from chatbot_utils import chatbot_response

app = FastAPI()

class Message(BaseModel):
    msg: str

@app.post("/chat")
def chat(message: Message):
    response = chatbot_response(message.msg)
    return {"response": response}
