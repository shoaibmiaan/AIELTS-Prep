// src/scripts/uploadListeningTest.ts
import { readFileSync } from 'fs';
import { join } from 'path';
import { uploadListeningTest, AIListeningTest } from '../lib/listeningUploader';
import { createClient } from '@supabase/supabase-js';

// Initialize a separate Supabase client for scripts:
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.error('Usage: npx ts-node src/scripts/uploadListeningTest.ts <filename>.json');
    process.exit(1);
  }

  const filePath = join(process.cwd(), 'src', 'data', 'listening-tests', filename);
  let payload: AIListeningTest;
  try {
    payload = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err: any) {
    console.error('Failed to read/parse JSON:', err.message);
    process.exit(1);
  }

  try {
    const { testId } = await uploadListeningTest(payload);
    console.log('✅ Uploaded test with id:', testId);
  } catch (err: any) {
    console.error('❌ Upload error:', err.message);
    process.exit(1);
  }
}

main();
