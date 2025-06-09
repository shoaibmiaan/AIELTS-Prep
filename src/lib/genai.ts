// src/lib/genai.ts
export async function generateFeedback(text: string): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `You're an IELTS examiner. Evaluate the following essay and give constructive feedback along with a band score (e.g. Band: 6.5).\n\nEssay:\n${text}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok || !result.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('❌ Gemini API error:', result);
    throw new Error('Gemini API call failed');
  }

  return result.candidates[0].content.parts[0].text.trim();
}
