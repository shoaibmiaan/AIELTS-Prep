import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { OpenAI } from "openai";
import axios from "axios";
import { callGemini } from "@/lib/geminiClient";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId, recordings, prompts } = req.body as {
      userId: string;
      recordings: string[]; // URLs to uploaded audio
      prompts: { id: number; question: string }[];
    };

    if (!userId || !recordings || !prompts || recordings.length !== prompts.length) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    let overallFeedback = "";

    for (let i = 0; i < recordings.length; i++) {
      const audioUrl = recordings[i];
      const prompt = prompts[i];

      // Download audio file buffer from URL
      const audioResponse = await axios.get<ArrayBuffer>(audioUrl, { responseType: "arraybuffer" });
      const audioBuffer = Buffer.from(audioResponse.data);

      // Transcribe with OpenAI Whisper API
      const transcriptResponse = await openai.audio.transcriptions.create({
        file: audioBuffer,
        model: "whisper-1",
        // format: "text", // defaults to text
      });

      const transcript = transcriptResponse.text;

      // Gemini scoring for this answer
      const geminiPrompt = `
You are an IELTS examiner. Grade the following response to the question: "${prompt.question}".

Answer:
${transcript}

Provide a band score from 0 to 9 and a brief explanation of the score.
`;

      const geminiResponse = await callGemini(geminiPrompt);

      // Save to Supabase DB
      await supabase.from("speaking_evaluations").insert({
        user_id: userId,
        prompt_id: prompt.id,
        recording_url: audioUrl,
        transcript,
        band_score: geminiResponse.score ?? null,
        feedback: geminiResponse.feedback ?? geminiResponse.text ?? null,
        created_at: new Date().toISOString(),
      });

      overallFeedback += `Question ${i + 1}:\nBand Score: ${geminiResponse.score ?? "N/A"}\nFeedback: ${
        geminiResponse.feedback ?? geminiResponse.text ?? "No feedback"
      }\n\n`;
    }

    res.status(200).json({ feedback: overallFeedback.trim() });
  } catch (error: any) {
    console.error("Evaluation API error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
