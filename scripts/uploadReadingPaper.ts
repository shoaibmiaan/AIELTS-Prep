const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') }); // Load from .env.local

// Load your paper JSON
const filePath = path.join(__dirname, 'reading_test_schema_example.json');
const paperJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Use env variables for Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials! Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadPaper() {
  try {
    // 1. Insert Paper
    const paperId = uuidv4();
    const { error: paperError } = await supabase.from('reading_papers').insert([{
      id: paperId,
      title: paperJson.title,
      type: paperJson.type,
      status: paperJson.status || 'draft',
      created_at: paperJson.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]);
    if (paperError) throw paperError;
    console.log(`Inserted paper: ${paperJson.title} (${paperId})`);

    // 2. Insert Passages
    const passageIdMap = {};
    for (const passage of paperJson.passages) {
      const passageId = uuidv4();
      passageIdMap[passage.id] = passageId;

      const { error: passageError } = await supabase.from('reading_passages').insert([{
        id: passageId,
        paper_id: paperId,
        passage_number: passage.passage_number,
        title: passage.title,
        body: passage.body,
        section_instruction: passage.section_instruction,
        status: passage.status || 'draft',
        created_at: passage.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
      if (passageError) throw passageError;
      console.log(`  Inserted passage: ${passage.title} (${passageId})`);

      // 3. Insert Questions for this Passage
      for (const question of passage.questions) {
        const questionId = uuidv4();
        const questionRow = {
          id: questionId,
          passage_id: passageId,
          paper_id: paperId,
          question_number: question.question_number,
          question_type: question.question_type,
          text: question.text,
          instruction: question.instruction || null,
          options: question.options ? question.options : null,
          answer: question.answer ? question.answer : null,
          status: question.status || 'draft',
          created_at: question.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { error: questionError } = await supabase.from('reading_questions').insert([questionRow]);
        if (questionError) throw questionError;
        console.log(`    Inserted question #${question.question_number}: ${question.text.slice(0, 40)}...`);
      }
    }
    console.log('✅ Upload complete!');
  } catch (err) {
    console.error('❌ Error uploading paper:', err);
  }
}

uploadPaper();
