import CourseCreateModal from '../components/CourseCreateModal';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

type Course = {
  id: string;
  title: string;
  description: string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    setUserRole(profile.role);

    const query = profile.role === 'teacher'
      ? supabase.from('courses').select('*').eq('owner', user?.id)
      : supabase.from('courses').select('*').eq('published', true);

    const { data, error } = await query;

    if (error) toast.error(error.message);
    else setCourses(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) toast.error('Delete failed');
    else {
      toast.success('Course deleted');
      fetchCourses();
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Courses</h1>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-sm"
      />

      {userRole === 'teacher' && (
        <CourseCreateModal onCreated={fetchCourses} />
      )}

      {loading ? (
        <div className="mt-8 text-gray-600">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <div key={course.id} className="border p-4 rounded-lg bg-white shadow">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.description}</p>

              {userRole === 'teacher' && (
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => alert('TODO: Open Edit Modal')}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
