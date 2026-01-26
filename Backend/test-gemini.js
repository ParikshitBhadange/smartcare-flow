import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-1.0-pro",
    contents: [
      {
        role: "user",
        parts: [{ text: "Hello" }]
      }
    ]
  });

  console.log(response.text);
}

run();
