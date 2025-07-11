import React from "react";

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
  <div className="passages-container">
    {passages.length > 0 ? (
      passages
        .sort((a, b) => a.passage_number - b.passage_number)
        .map((passage) => (
          <div
            key={passage.id}
            className={`passage-pane ${activePassageId === passage.id ? 'active' : ''}`}
          >
            <h2 className="passage-title text-2xl font-bold mb-3">
              Passage {passage.passage_number}: {passage.title}
            </h2>

            {passage.section_instruction && (
              <div className="section-instruction text-lg mb-4 italic text-gray-700">
                {passage.section_instruction}
              </div>
            )}

            <div className="passage-body">
              {splitIntoParagraphs(passage.body).map((para, idx) => (
                <p key={idx} className="mb-3 text-base leading-relaxed">
                  <strong>{para.slice(0, 2)}</strong> {para.slice(2).trim()}
                </p>
              ))}
            </div>
          </div>
        ))
    ) : (
      <div className="no-passages">No passages found.</div>
    )}
  </div>
);

export default ReadingPassagePane;
