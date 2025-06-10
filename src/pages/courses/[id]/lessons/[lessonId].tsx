import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import dynamic from 'next/dynamic'

// Dynamically import editor to avoid SSR issues
const LessonEditor = dynamic(() => import('@/components/LessonEditor'), {
  ssr: false,
})

interface Lesson {
  id: string
  title: string
  content: string
  course_id: string
}

export default function LessonPage() {
  const router = useRouter()
  const { lessonId } = router.query
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!lessonId) return

    const fetchLesson = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (error) {
        console.error('Error fetching lesson:', error.message)
        alert('Failed to load lesson. Please try again.')
      } else {
        setLesson(data)
      }

      setLoading(false)
    }

    fetchLesson()
  }, [lessonId])

  const handleSave = async (html: string) => {
    if (!html.trim()) {
      alert('Lesson content cannot be empty.')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('lessons')
      .update({ content: html })
      .eq('id', lessonId)

    setSaving(false)

    if (error) {
      console.error('Error saving lesson:', error.message)
      alert('Error saving lesson. Please try again.')
    } else {
      alert('Lesson saved successfully.')
      setLesson((prev) => prev ? { ...prev, content: html } : null)
      setIsEditing(false)
    }
  }

  if (loading) return <p className="p-6 text-gray-600">Loading lesson...</p>
  if (!lesson) return <p className="p-6 text-red-600">Lesson not found.</p>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

      {isEditing ? (
        <LessonEditor initialContent={lesson.content} onSave={handleSave} />
      ) : (
        <div
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
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

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}

        <button
          onClick={() => router.push(`/courses/${lesson.course_id}`)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ← Back to Lessons
        </button>

        {saving && <span className="text-sm text-gray-500">Saving...</span>}
      </div>
    </div>
  )
}
