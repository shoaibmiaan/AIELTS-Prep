// src/components/listening/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <Link href="/" className="text-xl font-bold text-primary">
          Learn-with-Universe
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6">
          <Link
            href="/practice/listening/listening"
            className="text-gray-600 hover:text-primary transition"
          >
            Listening
          </Link>
          <Link
            href="/practice/reading"
            className="text-gray-600 hover:text-primary transition"
          >
            Reading
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-primary transition"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
