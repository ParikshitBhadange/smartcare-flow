import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import Inventory from "../models/inventory.model.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithBot = async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const inventory = await Inventory.find().lean();

    const safeLanguage =
      typeof language === "string" && language.length < 20
        ? language
        : "English";

    const prompt = `
You are SmartCare Medical Assistant.

STRICT RULES:
- Answer ONLY medical, healthcare, medicine, and inventory questions
- Do NOT diagnose diseases
- Do NOT replace a doctor
- Always add a short medical disclaimer
- If unrelated, politely refuse
- Respond in ${safeLanguage}

Inventory:
${JSON.stringify(inventory.slice(0, 30))}

User question:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-pro", // ✅ THIS WORKS
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    res.json({ reply: response.text });

  } catch (err) {
    console.error("❌ GEMINI ERROR:", err);
    res.status(500).json({
      error: "Chatbot failed",
      reason: err.message,
    });
  }
};
