//src/types/index.ts

export interface Course {
  id: string;
  title: string;
  description: string;
  owner: string;
  // Add other fields if needed
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order: number;
  // Add other fields if needed
}

export interface Profile {
  id: string;
  role: 'admin' | 'instructor' | 'student';
}
