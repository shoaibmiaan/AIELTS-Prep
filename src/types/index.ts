// src/types/index.ts

// Lesson interface for the lesson page or course
export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'grammar' | 'vocabulary' | 'strategy' | 'practice';
  duration_minutes: number; // Duration for the lesson
  order: number; // The order of the lesson in the course
  unlocked: boolean; // If the lesson is unlocked for the user
  ai_generated: boolean; // Whether the lesson was AI-generated
  next_lesson_id: string | null; // ID of the next lesson in sequence (for progression)
  owner: string; // User ID who created or owns the lesson
  target_band?: number; // Band score this lesson is optimized for
  focus_areas?: string[]; // Weaknesses addressed by the lesson (e.g., grammar, vocabulary)
  practice_questions?: PracticeQuestion[]; // Associated practice questions (if any)
}

// A course contains modules and lessons
export interface Course {
  id: string;
  title: string;
  description: string;
  owner: string;
  modules: Module[]; // Modules in the course
  created_at: string; // When the course was created
  updated_at: string; // Last update timestamp
}

// A module contains lessons and belongs to a course
export interface Module {
  id: string;
  title: string;
  order: number; // Order of the module in the course
  lessons: Lesson[]; // Lessons contained in this module
}

// Profile for users (students, instructors, etc.)
export interface Profile {
  id: string;
  role: 'admin' | 'instructor' | 'student'; // User role
  streak_count: number; // Current streak for learning activity
  last_active: string; // Last time the user was active
  target_band: number; // Band score that the user aims to achieve
  current_band?: number; // Optional current band score
  weaknesses: string[]; // Weaknesses identified (e.g., ['grammar', 'vocabulary'])
}

// Practice question for lessons (if applicable)
export interface PracticeQuestion {
  question: string; // The question text
  type: 'multiple-choice' | 'short-answer' | 'essay'; // Type of question
  options?: string[]; // Options for multiple-choice questions
}

// Data for tracking band score progression
export interface BandDataPoint {
  date: string; // Date when the data was recorded
  Task1?: number; // Task 1 band score
  Task2?: number; // Task 2 band score
}

// Writing attempt data
export interface WritingAttempt {
  id: string;
  user_id: string;
  prompt_text: string; // The prompt for the writing task
  response_text: string; // User's written response
  band: number; // Evaluated band score
  created_at: string; // Timestamp when the attempt was created
  feedback: string; // Feedback from the evaluator
}

// Tracks user progress for lessons or practice
export interface ProgressTracking {
  user_id: string; // User's ID
  lesson_id: string; // Lesson's ID
  activity_type: 'lesson_completed' | 'practice_completed'; // Type of activity
  created_at: string; // Timestamp when the activity was completed
}

// AI Feedback Response for writing or speaking assessments
export interface AIFeedbackResponse {
  scores: {
    taskAchievement: number; // Task Achievement score
    coherenceCohesion: number; // Coherence and Cohesion score
    lexicalResource: number; // Lexical Resource score
    grammaticalRange: number; // Grammatical Range score
  };
  feedback: {
    criterion: string; // Criterion the feedback refers to
    comments: string; // Detailed feedback comments
  }[];
  overallBand: number; // Overall band score
  overallComments: string; // General feedback
}
declare global {
  interface Window {
    PGOPTIONS: string;
  }
}