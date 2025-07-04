import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/layouts/MainLayout';

export default function PrepInstitute() {
  return (
    <Layout>
      <Head>
        <title>🏛️ The Prep Institute – AIELTS Courses & Lessons</title>
      </Head>
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold mb-2">🏛️ The Prep Institute</h1>
        <p className="text-gray-600 max-w-2xl">
          Welcome to your structured learning hub. Explore lessons, grammar modules, vocabulary builders, and recorded expert-led IELTS classes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '📘 Grammar', link: '/academy/grammar' },
            { title: '🧠 Vocabulary', link: '/academy/vocabulary' },
            { title: '🎥 Recorded Classes', link: '/academy/classes' },
            { title: '📋 Study Plans', link: '/academy/study-plans' },
            { title: '💡 IELTS Strategies', link: '/academy/strategies' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.link}
              className="bg-white hover:bg-orange-50 border rounded-xl p-5 shadow transition block"
            >
              <h2 className="font-semibold text-lg">{item.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
