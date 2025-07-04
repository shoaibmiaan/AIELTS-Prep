import { ReactNode } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function LandingDashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-900">
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500">
            Dashboard / {router.pathname.replace("/dashboard", "") || "Home"}
          </div>
          <Image src="/Logo.png" alt="Logo" width={30} height={30} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {children}
      </main>

      {/* Watermark */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400 opacity-50 select-none">
        © Learn with Solvio
      </div>
    </div>
  );
}
