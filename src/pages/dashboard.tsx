'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import CourseCreateModal from '@/components/CourseCreateModal';
import Avatar from '@/components/Avatar';

type Course = {
  id: string;
  title: string;
  description: string;
  owner: string;
};

type Profile = {
  role: 'student' | 'teacher' | string;
  full_name: string;
  avatar_url?: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data?.publicUrl;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error('User fetch failed during avatar upload.');
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update avatar URL in profile:', updateError.message);
      return;
    }

    window.location.reload();
  };

  const fetchData = useCallback(async () => {
    const sessionRes = await supabase.auth.getSession();
    if (!sessionRes.data.session) {
      router.replace('/login');
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      console.error('User not found or error occurred:', userError?.message);
      router.replace('/login');
      return;
    }

    setUserEmail(user.email || '');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (!profile || profileError) {
      console.error('Profile not found:', profileError?.message);
      router.replace('/login');
      return;
    }

    setProfile(profile);
    setUserRole(profile.role);

    if (profile.role === 'student') {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      setEnrollmentCount(enrollments?.length || 0);

      const courseIds = enrollments?.map((e) => e.course_id);
      if (courseIds?.length) {
        const { data: myCourses } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds)
          .limit(3);
        setCourses(myCourses || []);
      }
    } else if (profile.role === 'teacher') {
      const { data: teacherCourses } = await supabase
        .from('courses')
        .select('*')
        .eq('owner', user.id)
        .limit(3);

      setCourses(teacherCourses || []);

      const courseIds = teacherCourses?.map((c) => c.id) || [];

      if (courseIds.length > 0) {
        const { count } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .in('course_id', courseIds);
        setEnrollmentCount(count || 0);
      }
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar src={profile?.avatar_url || ''} />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="absolute top-0 left-0 w-14 h-14 opacity-0 cursor-pointer"
            title="Upload avatar"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">{profile?.full_name || userEmail}</p>
          <p className="text-sm text-gray-500 capitalize">{userRole} account</p>
        </div>
      </div>

      {/* Welcome Header */}
      <h1 className="text-2xl font-bold">
        {userRole === 'teacher' ? 'Teacher Dashboard' : 'Welcome Back!'}
      </h1>

      {userRole === 'student' && (
        <div className="mt-2 text-gray-600">
          You’re enrolled in <strong>{enrollmentCount}</strong> course{enrollmentCount !== 1 && 's'}.
        </div>
      )}

      {userRole === 'teacher' && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            📊 <strong>{enrollmentCount}</strong> total enrolled students
          </div>
          <CourseCreateModal onCreated={fetchData} />
        </div>
      )}

      {/* Recent Courses */}
      <p className="mt-6 text-gray-600">
        {userRole === 'student' ? 'Your enrolled courses:' : 'Your recent courses:'}
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded p-4 shadow bg-white hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{course.title}</h2>
            <p className="text-sm text-gray-600">{course.description}</p>
            <Link
              href={`/courses/${course.id}`}
              className="mt-2 inline-block text-blue-600 hover:underline text-sm"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>

      <Link
        href="/courses"
        className="inline-block mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {userRole === 'teacher' ? 'Manage All Courses' : 'Explore More Courses'}
      </Link>

      {/* Practice Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">Practice Section</h2>
        <p className="text-sm text-gray-600 mb-4">
          Practice Listening, Reading, Writing, and Speaking with AI feedback.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/practice/listening" className="bg-indigo-100 hover:bg-indigo-200 p-4 rounded text-center font-medium">
            🎧 Listening
          </Link>
          <Link href="/practice/reading" className="bg-green-100 hover:bg-green-200 p-4 rounded text-center font-medium">
            📚 Reading
          </Link>
          <Link href="/practice/writing" className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded text-center font-medium">
            ✍️ Writing
          </Link>
          <Link href="/practice/speaking" className="bg-pink-100 hover:bg-pink-200 p-4 rounded text-center font-medium">
            🎤 Speaking
          </Link>
        </div>
      </div>
    </div>
  );
}
