// src/lib/listeningUploader.ts
import { supabase } from './supabaseClient'

export interface AIListeningTest {
  title: string
  audioSrc: string
  sections: Array<{
    section: number
    instructions: string
    questions: Array<{
      questionNumber: number
      type: string
      questionText: string
      options?: string[]
      correctAnswer?: string[]
    }>
  }>
}

export async function uploadListeningTest(payload: AIListeningTest) {
  // 1) Insert the test
  const { data: test, error: testErr } = await supabase
    .from('listening_tests')
    .insert({
      title: payload.title,
      audio_src: payload.audioSrc || '',
    })
    .select('id')
    .single()
  if (testErr) throw new Error(`Test insert failed: ${testErr.message}`)
  const testId = test.id

  // 2) Insert each section
  for (const sec of payload.sections) {
    const { data: section, error: secErr } = await supabase
      .from('listening_sections')
      .insert({
        test_id: testId,
        section_number: sec.section,
        instructions: sec.instructions,
      })
      .select('id')
      .single()
    if (secErr) throw new Error(`Section ${sec.section} insert failed: ${secErr.message}`)
    const sectionId = section.id

    // 3) Insert its questions
    const rows = sec.questions.map((q) => ({
      section_id:      sectionId,
      question_number: q.questionNumber,
      type:             q.type,
      question_text:    q.questionText,
      options:          q.options?.length ? q.options : null,
      correct_answer:   q.correctAnswer?.length ? q.correctAnswer : null,
    }))
    const { error: qErr } = await supabase.from('listening_questions').insert(rows)
    if (qErr) throw new Error(`Questions for section ${sec.section} failed: ${qErr.message}`)
  }

  return { testId }
}
