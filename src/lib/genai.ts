// Shared Gemini client function to reduce code duplication
async function callGeminiAPI(prompt: string, model: string = 'gemini-1.5-flash'): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in your environment');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error(`❌ Gemini API (${model}) error:`, result);
    throw new Error(result.error?.message || `API call to ${model} failed`);
  }

  if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error(`❌ Gemini API (${model}) no content:`, result);
    throw new Error('Gemini response missing text output');
  }

  return result.candidates[0].content.parts[0].text.trim();
}

export async function generateFeedback(text: string): Promise<string> {
  const prompt = `
You're an IELTS Writing Task 1 examiner.

Use ONLY the **official IELTS Writing Task 1 Band Descriptors** to assess the task. These four criteria are used:

1. **Task Achievement**
2. **Coherence and Cohesion**
3. **Lexical Resource**
4. **Grammatical Range and Accuracy**

You must do the following:
- Provide a score (0 to 9) for each of the four criteria above.
- Include detailed, **constructive feedback** under each criterion.
- End with an **Overall Band Score** with justification.
- Stick strictly to IELTS standards (no sugar-coating or generic praise).
- Avoid suggesting improvements unrelated to IELTS evaluation criteria.

Now, evaluate this task:

${text}
  `;

  return callGeminiAPI(prompt);
}

export async function generateModule(
  text: string,
  instructions: string
): Promise<string> {
  const prompt = `
${instructions}

Here is the extracted content:

${text}

Please output valid JSON only, matching whatever schema your instructions describe.
  `.trim();

  return callGeminiAPI(prompt);
}

export async function generateAIReadingFeedback({
  answers,
  correctAnswers,
  raw_score,
  band_score,
}: {
  answers: Record<string, string>;
  correctAnswers: Record<string, string>;
  raw_score: number;
  band_score: number;
}): Promise<string> {
  const prompt = `
You're an IELTS Reading examiner. A student just completed a reading test.

Their raw score: ${raw_score}/40
Band score: ${band_score}

Here are their answers (by question number) and the correct answers:

${Object.entries(answers)
    .map(([q, ans]) => `Q${q}: User: "${ans}", Correct: "${correctAnswers[q]}"`)
    .join('\n')}

Based on this, give feedback:
- Which question types were likely weak (if identifiable)?
- Suggestions to improve performance
- No fluff. No score explanation. Just helpful analysis.

Respond in 2–3 short paragraphs.
  `;

  return callGeminiAPI(prompt, 'gemini-pro');
}

export async function generateModuleJSON(
  text: string,
  instructions: string
): Promise<any> {
  const raw = await generateModule(text, instructions);
  try {
    return JSON.parse(raw);
  } catch (err: any) {
    throw new Error(
      `Failed to parse AI response as JSON. ` +
      `Error: ${err.message}\n` +
      `AI returned:\n${raw}`
    );
  }
}