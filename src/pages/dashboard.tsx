import { useAuth } from '@/context/AuthContext';
import Container from '@/components/Container';
import PageSection from '@/components/PageSection';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <PageSection title="Welcome Back">
        <Container>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Hello, {user?.name}</h3>
            <ThemeToggle />
          </div>
          <p className="mt-2">Your learning progress this week</p>
        </Container>
      </PageSection>

      <PageSection title="Your Progress">
        <Container className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <h4 className="font-bold">Vocabulary</h4>
              <p>120 words mastered</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="font-bold">Grammar</h4>
              <p>15 rules learned</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
              <h4 className="font-bold">Speaking</h4>
              <p>8 sessions completed</p>
            </div>
          </div>
        </Container>
      </PageSection>
    </div>
  );
}