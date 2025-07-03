// src/pages/admin/reading-importer.tsx
import dynamic from 'next/dynamic';

// ✅ Dynamically load ReadingImporterClient with SSR disabled to fix DOMMatrix error
const ReadingImporterClient = dynamic(
  () => import('@/components/admin/ReadingImporterClient'),
  { ssr: false }
);

export default function ReadingImporterPage() {
  return <ReadingImporterClient />;
}
