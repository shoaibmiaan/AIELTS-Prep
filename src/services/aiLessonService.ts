import { GoogleGenerativeAI } from "@google/generative-ai";
import { Lesson, Profile } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AIGenerationResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export const generateDynamicLesson = async (
  profile: Profile,
  lessonParams: Partial<Lesson>
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Create an IELTS lesson with these specifications:
    - Student level: Targeting Band ${profile.target_band || '6.5'}
    - Lesson type: ${lessonParams.type || 'general'}
    - Topic: ${lessonParams.title || 'IELTS preparation'}
    ${lessonParams.focus_areas?.length ? `- Focus areas: ${lessonParams.focus_areas.join(', ')}` : ''}

    Required sections:
    1. Clear explanation (200-300 words)
    2. Band-specific vocabulary (3-5 words with definitions)
    3. Practical examples
    4. Practice exercises (2-3 questions)
    5. Common mistakes to avoid

    Format as HTML with semantic tags (section, h2-h3, ul/ol, etc.)
    Use British English spelling conventions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Basic validation
    if (!text || text.length < 100) {
      throw new Error("Generated content is too short or invalid");
    }

    return text;
  } catch (error) {
    console.error("AI content generation failed:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to generate lesson content"
    );
  }
};

export const evaluatePracticeResponse = async (
  question: string,
  answer: string,
  targetBand: number
): Promise<{
  band: number;
  feedback: string[];
  modelAnswer: string;
}> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Evaluate this IELTS practice response for Band ${targetBand}:
    QUESTION: "${question}"
    RESPONSE: "${answer}"

    Provide evaluation in this JSON format:
    {
      "band": number (0-9),
      "feedback": string[] (3 specific improvements),
      "modelAnswer": string (band ${targetBand} level response)
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const evaluation = JSON.parse(text);

    if (!evaluation.band || !evaluation.feedback || !evaluation.modelAnswer) {
      throw new Error("Invalid evaluation format received");
    }

    return evaluation;
  } catch (error) {
    console.error("Evaluation failed:", error);
    return {
      band: 0,
      feedback: ["Evaluation failed. Please try again."],
      modelAnswer: "Could not generate model answer."
    };
  }
};