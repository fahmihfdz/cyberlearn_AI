import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Initialize Gemini API (Will use placeholder if not set)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'PLACEHOLDER');

app.get('/api/health', (req, res) => {
  res.json({
  status: 'CyberLearn AI Backend is running',
  port: PORT
});
});

app.get('/', (req, res) => {
  res.send('CyberLearn AI Backend Live');
});

// AI Assistant Route
app.post('/api/chat', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.json({ text: "Please set up your Gemini API Key in the backend `.env` file to use the AI features." });
    }
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are CyberLearn AI, an intelligent cybersecurity learning assistant designed for beginners and intermediate learners. Your mission is to help users learn cybersecurity in a simple, interactive, practical, and beginner-friendly way. Explain cybersecurity concepts clearly using simple language. Avoid overly technical jargon unless the user requests advanced explanations. Use real-world examples whenever possible. Structure answers with headings, bullet points, and short paragraphs. Focus on educational and ethical purposes only. Never provide dangerous, illegal, or harmful hacking instructions. Encourage ethical hacking and cybersecurity best practices.\n\nUser Input: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Roadmap Generator Route
app.post('/api/roadmap', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.json({ text: "Please set up your Gemini API Key in the backend `.env` file." });
    }
    const { career, level } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Create a personalized cybersecurity learning roadmap.\nCareer Goal: ${career}\nSkill Level: ${level}\nRequirements: Make the roadmap beginner-friendly, divide it into monthly phases, include topics to learn, recommended tools, practical exercises, mini projects. Keep it realistic and structured. Use bullet points. Encourage hands-on learning. Return output in Markdown structure using headings and bullet points.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error('Error in roadmap API:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Quiz Generator Route
app.post('/api/quiz', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.json({ quiz: [{question: "Please configure Gemini API Key", options: ["A", "B", "C", "D"], answer: "A", explanation: "Set key in .env"}] });
    }
    const { topic, difficulty } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate a cybersecurity quiz in JSON format. Topic: ${topic}, Difficulty: ${difficulty}. Create 5 multiple choice questions. Format strictly as a JSON array of objects: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "The correct option exactly as written in options", "explanation": "..."}]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Bersihkan markdown backticks dari output Gemini sebelum diparse
    const cleanText = text.replace(/```json\n?|```/g, '').trim();
    try {
  res.json({ quiz: JSON.parse(cleanText) });
} catch {
  res.status(500).json({ error: "AI returned invalid quiz format" });
}
  } catch (error) {
    console.error('Error in quiz API:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// File Summarizer Route
app.post('/api/summarize-file', upload.single('file'), async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(400).json({ error: "Please set up your Gemini API Key in the backend `.env` file." });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let extractedText = "";
    
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } else if (req.file.mimetype === 'text/plain') {
      extractedText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload PDF or TXT." });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "Could not extract text from the file or file is empty." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Summarize this cybersecurity learning material. Requirements: Extract key concepts, Use beginner-friendly explanations. Create: short summary, important points, key terms, practical takeaways. Keep the output concise and easy to scan. Material: \n\n${extractedText}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Error in summarize-file API:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
