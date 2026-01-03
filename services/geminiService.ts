
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Initialize the Gemini API client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUIZ_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: 'The question text' },
      type: { type: Type.STRING, enum: ['mcq', 'tf', 'fitb'], description: 'Question type' },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'For MCQ, provide 4 options'
      },
      correctAnswer: { type: Type.STRING, description: 'The correct answer' },
      explanation: { type: Type.STRING, description: 'Why this answer is correct' }
    },
    required: ['text', 'type', 'correctAnswer']
  }
};

export const generateQuizFromText = async (text: string, count: number = 5): Promise<Partial<Question>[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `請根據以下內容生成一個教學測驗。請用繁體中文（香港/澳門風格，適合廣東話語境）製作 ${count} 條唔同種類嘅題目。
    內容：${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA
    }
  });

  try {
    const questions = JSON.parse(response.text || '[]');
    return questions.map((q: any) => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9),
    }));
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return [];
  }
};

export const generateQuizFromMedia = async (base64Data: string, mimeType: string, count: number = 5): Promise<Partial<Question>[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: `你係一位專業教育專家。請仔細分析上載嘅 ${mimeType.includes('pdf') ? '文件' : '圖片'}。
          根據入面嘅重點同事實，生成一個包含 ${count} 條題目嘅測驗。
          請確保題目有唔同難度，並使用繁體中文（香港/澳門廣東話風格語體）編寫。
          請以 JSON 格式返回結果。`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA
    }
  });

  try {
    const questions = JSON.parse(response.text || '[]');
    return questions.map((q: any) => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9),
    }));
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return [];
  }
};
