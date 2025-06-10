import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { useState } from 'react'

interface Props {
  initialContent?: string
  onSave: (content: string) => void
}

export default function LessonEditor({ initialContent = '', onSave }: Props) {
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // disables built-in table so custom table extensions work
        table: false,
      }),
      Underline,
      Image,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-auto border-collapse border border-gray-300',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
  })

  const handleSave = () => {
    if (!editor) return
    setIsSaving(true)
    onSave(editor.getHTML())
    setTimeout(() => setIsSaving(false), 1000)
  }

  const addImage = () => {
    const url = prompt('Enter image URL')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="btn">Bold</button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn">Italic</button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="btn">Underline</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="btn">Bullets</button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="btn">Numbers</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H2</button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="btn">H3</button>
        <button onClick={addImage} className="btn">Image</button>
        <button onClick={insertTable} className="btn">Table</button>
      </div>

      {/* Editor */}
      <div className="border rounded p-4 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Lesson'}
      </button>
    </div>
  )
}
