// src/components/reading/ReadingPassagePane.tsx
import React from 'react';

interface Passage {
  id: string;
  passage_number: number;
  title: string;
  body?: string;
  section_instruction?: string | null;
}

interface ReadingPassagePaneProps {
  passages?: Passage[];
  activePassageId?: string;
}

const splitIntoParagraphs = (text?: string) =>
  text ? text.split(/\n(?=[A-Z]\.\s)/g) : [];

const ReadingPassagePane: React.FC<ReadingPassagePaneProps> = ({
  passages = [],
  activePassageId,
}) => (
  <div>
    {Array.isArray(passages) && passages.length > 0 ? (
      [...passages]
        .sort((a, b) => a.passage_number - b.passage_number)
        .map((passage) => (
          <div
            key={passage.id}
            className={`mb-8 ${activePassageId === passage.id ? 'bg-yellow-50' : ''}`}
          >
            <h2 className="text-xl font-bold mb-2 text-blue-800">
              Passage {passage.passage_number}: {passage.title}
            </h2>

            {passage.section_instruction && (
              <div className="mb-2 text-blue-700 font-semibold text-base border-l-4 pl-2 border-blue-300 bg-blue-50 rounded">
                {passage.section_instruction}
              </div>
            )}

            <div className="whitespace-pre-line text-base leading-relaxed bg-gray-50 rounded-xl p-4 border space-y-4">
              {splitIntoParagraphs(passage.body).map((para, idx) => (
                <p key={idx}>
                  <strong>{para.slice(0, 2)}</strong> {para.slice(2).trim()}
                </p>
              ))}
            </div>
          </div>
        ))
    ) : (
      <div className="text-lg p-8">No passages found.</div>
    )}
  </div>
);

export default ReadingPassagePane;
