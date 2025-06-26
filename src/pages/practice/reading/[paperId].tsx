'use client';

import { useRouter } from 'next/router';
import { ieltsPastPapers } from '@/lib/readingData/paper11';

export default function ReadingPracticePage() {
  const router = useRouter();
  const { paperId } = router.query;

  if (!paperId || Array.isArray(paperId)) return <p>Loading...</p>;

  const paper = ieltsPastPapers.find((p) => p.id === paperId);
  if (!paper) return <p>❌ Paper not found</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{paper.title}</h2>
      <p>{paper.instructions}</p>

      {'passages' in paper ? (
        paper.passages.map((passage, i) => (
          <div key={passage.id} style={{ marginBottom: '2rem' }}>
            <h3>Passage {i + 1}: {passage.title}</h3>
            <p>{passage.content}</p>
            <ol>
              {passage.questions.map(q => (
                <li key={q.number}>
                  {q.question}
                  {q.options && (
                    <ul>
                      {q.options.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))
      ) : (
        paper.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '2rem' }}>
            <h3>{section.title}</h3>
            {section.texts.map(text => (
              <div key={text.id}>
                <p>{text.content}</p>
                <ol>
                  {text.questions.map(q => (
                    <li key={q.number}>
                      {q.question}
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
