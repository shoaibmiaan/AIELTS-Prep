import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface CourseCreateModalProps {
  onCreated: () => void;
}

export default function CourseCreateModal({ onCreated }: CourseCreateModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Error: User not found.');
      return;
    }

    const { error } = await supabase.from('courses').insert({
      title,
      description,
      published,
      owner: user.id,
    });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      onCreated(); // Refresh dashboard
      setOpen(false);
      setTitle('');
      setDescription('');
      setPublished(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
      >
        + Create New Course
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <span>Published</span>
              </label>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
