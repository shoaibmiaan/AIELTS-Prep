// components/StudyPlanItem.tsx
import { theme } from '../styles/theme';

interface StudyPlanItemProps {
  lesson: Lesson;
  continueLesson: (id: number) => void;
  darkMode: boolean;
}

const StudyPlanItem: React.FC<StudyPlanItemProps> = ({ lesson, continueLesson, darkMode }) => {
  const moduleColors = {
    Writing: theme.colors.accent.writing,
    Listening: theme.colors.accent.listening,
    Speaking: theme.colors.accent.speaking,
    Reading: theme.colors.accent.reading,
  };

  return (
    <div className={`p-4 rounded-lg border ${
      lesson.locked
        ? `border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700`
        : `border-yellow-100 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900`
    } transition-all duration-300`}>
      {/* ... rest of the component ... */}
      <div
        className="h-2 rounded-full"
        style={{
          width: `${lesson.progress}%`,
          backgroundColor: moduleColors[lesson.module as keyof typeof moduleColors]
        }}
      ></div>
    </div>
  );
};