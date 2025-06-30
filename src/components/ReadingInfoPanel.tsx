// src/components/ReadingInfoPanel.tsx

"use client";

export default function ReadingInfoPanel() {
  return (
    <aside className="max-w-2xl p-4 mb-8 bg-slate-50 rounded-xl shadow text-base">
      <h2 className="font-bold text-xl mb-2">IELTS Reading Test Guide</h2>
      <p>
        The IELTS Reading Test has two versions: <strong>Academic</strong> and <strong>General Training</strong>. Each has 3 sections and a total of 40 questions, with 60 minutes to complete all sections.
      </p>
      <ul className="list-disc ml-6 my-3">
        <li><b>Academic:</b> 3 long academic texts from books, journals, magazines, and newspapers. Topics cover science, history, education, and more.</li>
        <li><b>General Training:</b> Mix of short factual texts (Section 1 & 2) and one longer text (Section 3) from real-life sources such as ads, guides, company handbooks, etc.</li>
      </ul>
      <div className="my-3">
        <b>Band Score Calculation:</b><br />
        Each correct answer = 1 point (max 40). Raw scores convert to bands (0–9) based on standard IELTS tables.<br />
        <a className="text-blue-600 underline" href="https://www.ielts.org/about-ielts/how-ielts-is-scored" target="_blank">Official IELTS Band Score Conversion</a>
      </div>
      <details className="my-3">
        <summary className="cursor-pointer font-semibold">What types of questions will you face?</summary>
        <ul className="list-disc ml-6 mt-2">
          <li>Matching Information</li>
          <li>Matching Headings</li>
          <li>Matching Features</li>
          <li>Identifying Information (True/False/Not Given)</li>
          <li>Identifying Writer's Views/Claims (Yes/No/Not Given)</li>
          <li>Multiple Choice</li>
          <li>Matching Sentence Endings</li>
          <li>Sentence, Summary, Note, Table, Flow-Chart Completion</li>
          <li>Diagram Label Completion</li>
          <li>Short Answer Questions</li>
        </ul>
        <p className="mt-2">
          <b>Tip:</b> Practice all types to maximize your score! Answers are usually in passage order for most question types.
        </p>
      </details>
      <div className="my-3">
        <b>Practice strategy:</b>
        <ul className="list-disc ml-6">
          <li>Read questions first, then skim the passage.</li>
          <li>Take brief notes beside each paragraph.</li>
          <li>Scan for keywords and answer types.</li>
          <li>Answer easier question types (like Headings) first.</li>
        </ul>
      </div>
      <details>
        <summary className="cursor-pointer font-semibold">See all official IELTS Reading question types</summary>
        <div className="mt-2">
          <ul className="list-disc ml-6">
            <li>Matching Information</li>
            <li>Matching Headings</li>
            <li>Matching Features</li>
            <li>Identifying Information (True/False/Not Given)</li>
            <li>Identifying Writer's Views/Claims (Yes/No/Not Given)</li>
            <li>Multiple Choice</li>
            <li>Matching Sentence Endings</li>
            <li>Sentence Completion</li>
            <li>Summary Completion</li>
            <li>Note/Table/Flow-Chart Completion</li>
            <li>Diagram Label Completion</li>
            <li>Short Answer Questions</li>
          </ul>
        </div>
      </details>
      <div className="my-4">
        <a
          href="https://www.ielts.org/about-ielts/how-ielts-is-scored"
          target="_blank"
          rel="noopener"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Learn more about IELTS Scoring
        </a>
      </div>
    </aside>
  );
}
