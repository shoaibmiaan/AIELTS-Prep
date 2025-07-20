// layouts/AuthenticatedLayout.tsx
'use client'

import { ReactNode } from 'react'
import { useAuthProfile } from '@/hooks/useAuthProfile'
import Sidebar from '@/components/layout/Sidebar'
import AdminPanel from '@/components/admin/AdminPanel'

interface AuthenticatedLayoutProps {
  children: ReactNode
  showAdminPanel?: boolean
}

export default function AuthenticatedLayout({
  children,
  showAdminPanel = false
}: AuthenticatedLayoutProps) {
  const { role } = useAuthProfile()

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {showAdminPanel && role === 'admin' && <AdminPanel />}
    </div>
  )
}