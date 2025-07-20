import { useRouter } from 'next/router';

const writingTasks = [
  { id: '1', type: 'Task 1 Academic', description: 'Describe a chart' },
  { id: '2', type: 'Task 2', description: 'Essay writing' }
];

export default function WritingLibrary() {
  const router = useRouter();

  return (
    <div className="library">
      <h1>Writing Practice Tasks</h1>
      <div className="task-list">
        {writingTasks.map(task => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => router.push(`/assessmentRoom/writing/${task.id}`)}
          >
            <h3>{task.type}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}