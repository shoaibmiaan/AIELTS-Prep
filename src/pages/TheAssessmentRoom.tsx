import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/layouts/MainLayout';

export default function AssessmentRoom() {
  return (
    <Layout>
      <Head>
        <title>🧠 The Assessment Room – AIELTS Practice Tests</title>
      </Head>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold mb-2">🧠 The Assessment Room</h1>
        <p className="text-gray-600 max-w-2xl">
          This is your testing ground. Attempt full-length mock exams, practice each IELTS module, and track your band scores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '📖 Reading Tests', link: '/practice/reading' },
            { title: '🎧 Listening Tests', link: '/practice/listening' },
            { title: '🗣️ Speaking Practice', link: '/practice/speaking/speaking' },
            { title: '✍️ Writing Practice', link: '/practice/writing/WritingStartPage' },
            { title: '📊 Band Tracker', link: '/profile' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="bg-white hover:bg-blue-50 border rounded-xl p-5 shadow transition block"
            >
              <h2 className="font-semibold text-lg">{item.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
