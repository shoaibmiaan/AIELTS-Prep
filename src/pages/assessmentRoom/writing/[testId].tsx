import { useRouter } from 'next/router';

export default function WritingTest() {
  const { testId } = useRouter().query;

  return (
    <div className="writing-test">
      <h1>Writing Task {testId}</h1>
      {testId === '1' ? (
        <div>
          <p>Describe the following chart:</p>
          {/* Chart image would go here */}
          <textarea className="response-area" />
        </div>
      ) : (
        <div>
          <p>Write an essay on the following topic:</p>
          <textarea className="response-area" />
        </div>
      )}
    </div>
  );
}