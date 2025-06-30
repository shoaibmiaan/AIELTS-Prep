// src/pages/admin/index.tsx
import Link from 'next/link'
import Layout from '@/components/Layout'

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛠 Admin Dashboard</h1>

        <ul className="space-y-4">
          <li>
            <Link href="/admin/pdf-importer" className="text-blue-600 hover:underline">
              📄 Import Reading PDF
            </Link>
          </li>
          <li>
            <Link href="/admin/reading-library" className="text-blue-600 hover:underline">
              📚 View Saved Reading Papers
            </Link>
          </li>
          <li>
            <Link href="/admin/manual-upload" className="text-blue-600 hover:underline">
              ✍️ Manual Upload
            </Link>
          </li>
          {/* Add more links here later like writing, speaking, listening importers */}
        </ul>
      </div>
    </Layout>
  )
}
