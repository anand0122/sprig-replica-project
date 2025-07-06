import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiQuestion {
  id: string;
  type: string;
  question: string;
  required: boolean;
  options?: string[];
}

export interface GeminiForm {
  title: string;
  description: string;
  questions: GeminiQuestion[];
}

// Initialize client once; model can be reused across requests
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Gemini Flash model (adjust if you have access to a different version)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateFormFromPrompt(prompt: string): Promise<GeminiForm> {
  // fallback mock if no key
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      title: 'Untitled Form',
      description: 'Generated using mock',
      questions: [
        { id: 'q1', type: 'short-answer', question: 'Your name', required: true },
        { id: 'q2', type: 'email', question: 'Email address', required: true },
      ],
    };
  }
  // Instruction for the model: enforce JSON output
  const systemInstruction = `You are an expert form designer. Always respond with valid JSON (no markdown fences) in the following schema:\n{\n  \"title\": string,\n  \"description\": string,\n  \"questions\": [ { id: string, type: string, question: string, required: boolean, options?: string[] } ]\n}`;

  // Many Gemini models accept a single prompt string; combine system + user instructions
  const combinedPrompt = `${systemInstruction}\n\nUser Prompt:\n${prompt}`;
  const result = await model.generateContent(combinedPrompt);

  const raw = (result as any).response ? result.response.text() : (result as any).text();
  // Remove ```json fences if the model adds them
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini response parse error: ${err instanceof Error ? err.message : String(err)}`);
  }
} 