// pages/courses/[id]/lessons/[lessonId].tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import dynamic from 'next/dynamic'

// Dynamically import editor to avoid SSR issues
const LessonEditor = dynamic(() => import('@/components/LessonEditor'), {
  ssr: false,
})

export default function LessonPage() {
  const router = useRouter()
  const { lessonId } = router.query
  const [lesson, setLesson] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!lessonId) return
    const fetchLesson = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (!error) setLesson(data)
    }
    fetchLesson()
  }, [lessonId])

  const handleSave = async (html: string) => {
    const { error } = await supabase
      .from('lessons')
      .update({ content: html })
      .eq('id', lessonId)

    if (!error) {
      alert('Lesson saved successfully')
      setLesson((prev: any) => ({ ...prev, content: html }))
      setIsEditing(false)
    } else {
      console.error(error)
      alert('Error saving lesson')
    }
  }

  if (!lesson) return <p className="p-6 text-gray-600">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

      {isEditing ? (
        <LessonEditor initialContent={lesson.content} onSave={handleSave} />
      ) : (
        <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}

      <div className="flex items-center gap-3">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit Lesson
          </button>
        )}

        <button
          onClick={() => router.push(`/courses/${lesson.course_id}`)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ← Back to Lessons
        </button>
      </div>
    </div>
  )
}
