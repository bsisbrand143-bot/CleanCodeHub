
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, targetLang } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Convert the following code to ${targetLang}. Only return the code, nothing else:\n\n${code}`;
    
    const result = await model.generateContent(prompt);
    res.status(200).json({ result: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: 'Gemini API एरर: ' + error.message });
  }
}
