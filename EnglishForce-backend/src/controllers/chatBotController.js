// controllers/geminiController.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchCourseInSentences } from '../services/course.service.js';
import axios from "axios";

const FASTAPI_CHATBOT_URL = process.env.FASTAPI_CHATBOT_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new GoogleGenerativeAI(
  GEMINI_API_KEY,
);
const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
export const generateResponseController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent("Limit in 5 sentences: " + prompt);
    // console.log(result.response.text())
    res.json(result.response.text());
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Integrate web data into chatbot 
const intents = [
  { type: "price", keywords: ["giá", "bao nhiêu", "cost", "price"] },
  { type: "rating", keywords: ["đánh giá", "rating", "review", "stars"] },
  { type: "description", keywords: ["khóa học gì", "nội dung", "describe"] },
];

function detectIntent(userInput) {
  const lowerInput = userInput.toLowerCase();
  for (const intent of intents) {
    if (intent.keywords.some(keyword => lowerInput.includes(keyword))) return intent.type;
  }
  return "general"; // Nếu không nhận diện được thì mặc định là câu hỏi chung
}


async function getCourseInfo(prompt, intent) {
  var course = await searchCourseInSentences(prompt, 1);
  if (!course || course.length == 0) return null;
  course=course[0]

  const MAX_LENGTH = 200; // Độ dài tối đa cho phép
  const SUFFIX = '...'; // Hậu tố thêm vào cuối chuỗi nếu bị cắt
  if (course.description && course.description.length > MAX_LENGTH) 
    course.description = course.description.slice(0, MAX_LENGTH - SUFFIX.length) + SUFFIX;

  switch (intent) {
    case "price":
      return `Course "${course.name}" has price: ${course.price}$.`;
    case "rating":
      return `Course "${course.name}" has rating: ${course.rating}.`;
    case "description":
      return `Course "${course.name}": ${course.description} and has price: ${course.price}$.`;
    default:
      return `Course data: ${JSON.stringify(course)}`;
  }
}
export const generateResponseWithWebDataController = async (req, res) => {
  try {
    var { prompt } = req.body;
    const intent = detectIntent(prompt);
    const courseInfo = await getCourseInfo(prompt, intent);

    prompt = "Respond clearly in no more than 9 sentences: " + prompt;

    if (courseInfo) {
      prompt = `${courseInfo}. ${prompt}`;
    }

    // console.log(prompt)
    const result = await model.generateContent(prompt);
    res.json(result.response.text());
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).send('Internal Server Error');
  }
}


// API call My chatbot (FastAPI server)
export const myChatbotController = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(`${FASTAPI_CHATBOT_URL}/chat`, { msg: prompt });

    res.status(200).json(response.data.response);
  } catch (error) {
    console.error('FastAPI chatbot error:', error.message);
    res.status(500).json({ error: 'Chatbot API error', details: error.message });
  }
};
