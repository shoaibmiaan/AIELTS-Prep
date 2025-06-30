// src/scripts/uploadAllListeningTests.ts
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { uploadListeningTest, AIListeningTest } from '../lib/listeningUploader';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const dir = join(process.cwd(), 'src', 'data', 'listening-tests');
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const filePath = join(dir, file);
    let payload: AIListeningTest;
    try {
      payload = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (err: any) {
      console.error(`❌ Failed to parse ${file}:`, err.message);
      continue;
    }
    try {
      const { testId } = await uploadListeningTest(payload);
      console.log(`✅ ${file} → ${testId}`);
    } catch (err: any) {
      console.error(`❌ Upload failed for ${file}:`, err.message);
    }
  }
}

main();
