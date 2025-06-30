    import { ieltsPastPapers } from '../../../lib/readingData/paper11';

    export default function PastPapersPage() {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">IELTS Past Papers</h1>
          <div className="grid gap-6">
            {ieltsPastPapers.map(paper => (
              <div key={paper.id} className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-semibold">{paper.title}</h2>
                <p className="text-gray-600 mt-2">{paper.instructions}</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }