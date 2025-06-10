import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ✅ Use alias if tsconfig allows

// Types
type Course = {
  id: string;
  title: string;
  description: string;
  owner: string;
};

type Lesson = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type Profile = {
  id: string;
  role: string;
};

export default function CourseDetails() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [loading, setLoading] = useState(true);
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [editing, setEditing] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();
        setProfile(profileData ?? null);
      }

      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      if (courseData) {
        setCourse(courseData);
        setTitleInput(courseData.title);
        setDescInput(courseData.description);
      }

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order', { ascending: true });
      setLessons(lessonsData ?? []);

      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .single();
        setEnrolled(!!enrollmentData);
      }

      setLoading(false);
    }

    fetchData();
  }, [id]);

  const isOwner = profile?.id === course?.owner;
  const isAdmin = profile?.role === 'admin';
  const canEdit = isOwner || isAdmin;

  async function handleEnroll() {
    setLoadingEnroll(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to enroll.');
      setLoadingEnroll(false);
      return;
    }
    const { error } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, course_id: id });
    if (error) alert(JSON.stringify(error));
    else setEnrolled(true);
    setLoadingEnroll(false);
  }

  function handleEditToggle() {
    setEditing(!editing);
  }

  async function handleSave() {
    setLoadingSave(true);
    const { error } = await supabase
      .from('courses')
      .update({ title: titleInput, description: descInput })
      .eq('id', id);
    if (error) alert(JSON.stringify(error));
    else {
      setCourse(prev => prev ? { ...prev, title: titleInput, description: descInput } : null);
      setEditing(false);
    }
    setLoadingSave(false);
  }

  async function handleAddLesson() {
    setLoadingAdd(true);
    const lastOrder = lessons.length ? Math.max(...lessons.map(l => l.order)) : 0;
    const { error } = await supabase
      .from('lessons')
      .insert({
        course_id: id,
        title: newTitle,
        content: newContent,
        order: lastOrder + 1,
      });
    setLoadingAdd(false);
    if (error) {
      alert(JSON.stringify(error));
      return;
    }
    setNewTitle('');
    setNewContent('');
    setShowAdd(false);
    const { data: updatedLessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .order('order', { ascending: true });
    setLessons(updatedLessons ?? []);
  }

  if (loading) return <div className="p-4">Loading course…</div>;
  if (!course) return <div className="p-4 text-red-600">Course not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow">
      {/* Course Header */}
      <div className="flex items-center justify-between">
        {editing ? (
          <input
            className="border p-2 flex-1 mr-4"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
          />
        ) : (
          <h1 className="text-2xl font-bold">{course.title}</h1>
        )}
        {!editing && canEdit && (
          <button
            onClick={handleEditToggle}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Edit Course
          </button>
        )}
      </div>

      {/* Description */}
      {editing ? (
        <textarea
          className="border p-2 w-full mt-4"
          rows={4}
          value={descInput}
          onChange={e => setDescInput(e.target.value)}
        />
      ) : (
        <p className="mt-4">{course.description}</p>
      )}
      {editing && (
        <div className="mt-2 space-x-2">
          <button
            onClick={handleSave}
            disabled={loadingSave}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loadingSave ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Enroll Button */}
      <div className="mt-6">
        {!enrolled ? (
          <button
            onClick={handleEnroll}
            disabled={loadingEnroll}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {loadingEnroll ? 'Enrolling…' : 'Enroll'}
          </button>
        ) : (
          <span className="px-4 py-2 bg-gray-200 rounded">Enrolled</span>
        )}
      </div>

      {/* Add Lesson */}
      {canEdit && (
        <div className="mt-6">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            {showAdd ? 'Cancel' : '+ Add Lesson'}
          </button>
        </div>
      )}
      {showAdd && (
        <div className="mt-4 bg-gray-50 p-4 rounded shadow-sm">
          <input
            type="text"
            placeholder="Lesson title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            rows={4}
            placeholder="Lesson content"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <button
            onClick={handleAddLesson}
            disabled={loadingAdd}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {loadingAdd ? 'Saving…' : 'Save Lesson'}
          </button>
        </div>
      )}

      {/* Lessons */}
      <h2 className="mt-8 text-lg font-semibold">Lessons:</h2>
      {lessons.length === 0 ? (
        <p className="italic mt-2">No lessons added yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/courses/${id}/lessons/${lesson.id}`}
                className="text-blue-600 hover:underline"
              >
                {lesson.order}. {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
