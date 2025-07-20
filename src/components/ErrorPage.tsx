import { useRouter } from 'next/router';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error;
  onReset?: () => void;
  showActions?: boolean;
}

export default function ErrorPage({ error, onReset, showActions = true }: ErrorPageProps) {
  const router = useRouter();

  // ... rest of the component remains the same ...

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="max-w-lg text-center">
        {/* ... status code and message ... */}

        {showActions && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onReset ? onReset() : window.location.reload()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
            >
              Try Again
            </button>

            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition"
            >
              Go Back
            </button>

            {/* Fixed Link component */}
            <Link
              href="/"
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg transition hover:bg-gray-200"
            >
              Home Page
            </Link>
          </div>
        )}

        {/* ... error details ... */}
      </div>
    </div>
  );
}