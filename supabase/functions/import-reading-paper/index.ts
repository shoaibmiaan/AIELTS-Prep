// File: supabase/functions/import-reading-paper/index.ts
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const body = await req.json();

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const paper = body;
  if (!paper || !paper.passages) {
    return new Response(JSON.stringify({ error: 'Missing passages' }), { status: 400 });
  }

  // Insert reading paper
  const { data: paperData, error: paperError } = await supabaseClient
    .from('reading_papers')
    .insert({
      title: paper.title,
      type: paper.type,
      status: 'draft'
    })
    .select()
    .single();

  if (paperError) {
    return new Response(JSON.stringify({ error: paperError.message }), { status: 500 });
  }

  const passageInserts = [];
  const questionInserts = [];

  for (const passage of paper.passages) {
    const { data: passageData, error: passageError } = await supabaseClient
      .from('reading_passages')
      .insert({
        paper_id: paperData.id,
        passage_number: passage.passage_number,
        passage_title: passage.title,
        passage_text: passage.body, // preserves \n newlines
        section_instruction: passage.section_instruction || null
      })
      .select()
      .single();

    if (passageError) {
      return new Response(JSON.stringify({ error: passageError.message }), { status: 500 });
    }

    for (const question of passage.questions) {
      questionInserts.push({
        paper_id: paperData.id,
        passage_id: passageData.id,
        question_number: question.number,
        question_type: question.type,
        text: question.text,
        options: question.options ? JSON.stringify(question.options) : null,
        answer: question.answer,
        instruction: question.instruction || null,
        status: 'draft'
      });
    }
  }

  const { error: questionInsertError } = await supabaseClient
    .from('reading_questions')
    .insert(questionInserts);

  if (questionInsertError) {
    return new Response(JSON.stringify({ error: questionInsertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, paper_id: paperData.id }), { status: 200 });
});
