import api from './http';
import { aiService, GeneratedForm } from './aiService';

/**
 * Thin wrapper: call backend /api/ai endpoints (Gemini-Flash)
 * If backend fails (network / 501), fall back to client-side mock service so the UI still works.
 */

export async function generateForm(
  prompt: string,
  formType = 'custom',
  language = 'en',
  style = 'modern'
): Promise<GeneratedForm> {
  try {
    const res: any = await api.post('/ai/generate-form', {
      prompt,
      formType,
      language,
      style,
    });
    return res.form || res; // backend wraps in { form }
  } catch (err) {
    return aiService.generateFormFromText(prompt, { formType });
  }
}

export async function generateBloomsQuiz(
  prompt: string,
  taxonomyLevel: string,
  difficulty: string,
  questionCount: number
): Promise<GeneratedForm> {
  try {
    const res: any = await api.post('/ai/generate-quiz', {
      prompt,
      taxonomyLevel,
      difficulty,
      questionCount,
    });
    return res.form || res;
  } catch (err) {
    return aiService.generateBloomsQuiz(prompt, {
      taxonomyLevel,
      difficulty,
      questionCount,
    });
  }
}

export async function generateQuestionsFromImage(imageData: string): Promise<GeneratedForm> {
  try {
    const res: any = await api.post('/ai/generate-from-image', {
      imageUrl: imageData,
    });
    return res.form || res;
  } catch {
    return aiService.generateQuestionsFromImage(imageData);
  }
}

export async function generateFormFromUrl(url: string, formType = 'custom'): Promise<GeneratedForm> {
  try {
    const res: any = await api.post('/ai/generate-from-url', { url, formType });
    return res.form || res;
  } catch {
    const extracted = await aiService.extractContentFromUrl(url);
    return aiService.generateFormFromText(extracted, { formType });
  }
}

export async function generateSimilarQuiz(content: string): Promise<GeneratedForm> {
  try {
    const res: any = await api.post('/ai/generate-similar', { content });
    return res.form || res;
  } catch {
    return aiService.generateSimilarQuiz(content);
  }
} 