/**
 * Call Gemini AI to get IELTS Writing Task 1 feedback.
 * Returns the raw text response containing:
 * - Four criterion scores (0–9)
 * - Detailed feedback under each
 * - Overall Band Score with justification
 */
export async function generateFeedback(text: string): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in your environment');
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: `
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
`,
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();
  if (!response.ok || !result.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('❌ Gemini API error:', result);
    throw new Error('Gemini API call failed');
  }

  return result.candidates[0].content.parts[0].text.trim();
}

/**
 * Run a free-form “Help from AI” prompt against Gemini.
 * Returns whatever the model replied as a raw string.
 */
export async function generateModule(
  text: string,
  instructions: string
): Promise<string> {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in your environment');
  }

  const prompt = `
${instructions}

Here is the extracted content:

${text}

Please output valid JSON only, matching whatever schema your instructions describe.
`.trim();

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  const result = await response.json();
  if (!response.ok) {
  console.error('❌ Gemini API HTTP error:', result);
  throw new Error(result.error?.message || 'AI generation failed');
}
if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
  console.error('❌ Gemini API no content:', result);
  throw new Error('Gemini response missing text output.');
}


  return result.candidates[0].content.parts[0].text.trim();
}

/**
 * Wraps generateModule(...) and parses its output as JSON.
 * Throws a descriptive error if parsing fails.
 */
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

/**
 * Call Gemini AI to get IELTS Reading feedback for a student's performance.
 * Returns a short, targeted analysis.
 */
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in your environment');

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '⚠️ No feedback generated.';
}
