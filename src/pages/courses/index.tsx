import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CourseCreateModal from '@/components/CourseCreateModal';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  description: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRole, setUserRole] = useState('');

  const fetchCourses = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    setUserRole(profile?.role || '');

    const query = profile?.role === 'teacher'
      ? supabase.from('courses').select('*').eq('owner', user.id)
      : supabase.from('courses').select('*').eq('published', true);

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      setCourses(data || []);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Courses</h1>

      {userRole === 'teacher' && (
        <CourseCreateModal onCreated={fetchCourses} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{course.title}</h2>
            <p className="mt-2">{course.description}</p>
            <Link
              href={`/courses/${course.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
