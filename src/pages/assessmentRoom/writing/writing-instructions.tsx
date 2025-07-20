import Link from 'next/link';

export default function WritingInstructions() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 space-y-8">
      <h1 className="text-4xl font-bold text-blue-700">IELTS Writing Practice - Instructions</h1>

      <p className="text-lg">
        Great! Let's go step by step for both <strong>formal</strong> and <strong>informal writing</strong>,
        covering <strong>letters</strong> and <strong>essays</strong>.
      </p>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900">1. Formal Writing (Essays & Letters)</h2>
        <p className="mb-4">
          Formal writing is used in <em>academic, professional, or official communications</em>. The tone is
          <strong> polite, structured, and precise</strong>.
        </p>

        <h3 className="text-xl font-semibold">Formal Letter Writing</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Greeting:</strong> Use “Dear [Recipient’s Name],” or “To Whom It May Concern,”.</li>
          <li><strong>Introduction:</strong> Clearly state the purpose of the letter in the first paragraph.</li>
          <li><strong>Body:</strong> Provide structured arguments or explanations, maintaining professionalism.</li>
          <li><strong>Closing:</strong> End with “Sincerely” or “Best Regards”.</li>
        </ul>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
          "I am writing to express my interest in the position of Software Engineer at your company. My experience
          aligns well with your requirements, and I am eager to contribute to your team."
        </blockquote>

        <h3 className="text-xl font-semibold mt-6">Formal Essay Writing</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Introduction:</strong> Begin with a thesis statement—clearly stating topic and stance.</li>
          <li><strong>Body:</strong> One main idea per paragraph with supporting examples.</li>
          <li><strong>Transitions:</strong> Use connectors like "Furthermore," "In contrast," "Therefore".</li>
          <li><strong>Conclusion:</strong> Summarize and reinforce your argument.</li>
        </ul>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 space-y-1">
          <p><strong>Topic:</strong> The Importance of AI in Education</p>
          <p><strong>Thesis:</strong> “Artificial intelligence is transforming education by improving personalized learning experiences and automating administrative tasks.”</p>
          <p><strong>Conclusion:</strong> “AI is not replacing educators but enhancing their ability to provide quality education efficiently.”</p>
        </blockquote>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900">2. Informal Writing (Essays & Letters)</h2>
        <p className="mb-4">
          Informal writing is used in <em>personal or casual communication</em>. The tone is
          <strong> friendly, conversational, and engaging</strong>.
        </p>

        <h3 className="text-xl font-semibold">Informal Letter Writing</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Greeting:</strong> Use “Hi [Name],” or “Hey there!”</li>
          <li><strong>Intro:</strong> Start with a warm, engaging opening.</li>
          <li><strong>Body:</strong> Share experiences or emotions naturally.</li>
          <li><strong>Closing:</strong> Use “See you soon!” or “Take care!”</li>
        </ul>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
          “Hey Ali! I just got back from an incredible trip to Turkey. The food was amazing, and the history blew my mind. Wish you could’ve been there!”
        </blockquote>

        <h3 className="text-xl font-semibold mt-6">Informal Essay Writing</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Intro:</strong> Use a personal anecdote or hook.</li>
          <li><strong>Body:</strong> Write naturally but stay organized.</li>
          <li><strong>Tone:</strong> Conversational, rhetorical questions are fine.</li>
          <li><strong>Conclusion:</strong> End with personal reflection.</li>
        </ul>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 space-y-1">
          <p><strong>Hook:</strong> “Remember when friendships used to be built on weekend meetups rather than likes and comments?”</p>
          <p><strong>Conclusion:</strong> “While social media connects us, it’s up to us to maintain meaningful relationships beyond the screen.”</p>
        </blockquote>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900">3. Strategies to Improve Writing Band</h2>
        <ul className="list-decimal list-inside space-y-4">
          <li>
            <strong>Structure Clearly:</strong> Strong intro, focused body, solid conclusion.
          </li>
          <li>
            <strong>Coherence & Cohesion:</strong> Use transition words and maintain consistent tone.
          </li>
          <li>
            <strong>Vocabulary & Grammar:</strong> Avoid repetition, use synonyms, and correct grammar.
          </li>
          <li>
            <strong>Writing Techniques:</strong> Vary sentence length, avoid redundancy, use rhetorical devices.
          </li>
          <li>
            <strong>Arguments & Evidence:</strong> Support ideas with facts or real experiences, stay balanced.
          </li>
          <li>
            <strong>Time Management:</strong> Plan, write, and proofread—don’t skip editing!
          </li>
          <li>
            <strong>Practice & Feedback:</strong> Compare model responses, use editing tools, track improvement.
          </li>
        </ul>
      </section>

      <div className="text-center pt-6">
        <Link href="/assessmentRoom/writing/WritingStartPage">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg transition">
            Start Writing Practice
          </button>
        </Link>
      </div>
    </div>
  );
}
