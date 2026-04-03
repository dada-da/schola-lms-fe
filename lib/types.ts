/**
 * types.ts — Shared TypeScript types for ScholaLMS.
 *
 * Import from here rather than defining inline types in each page:
 *   import type { User, CourseProgress } from '@/lib/types'
 */

// ─── User ──────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'instructor' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  initials: string
  role: UserRole
  plan: 'starter' | 'pro' | 'team'
  createdAt: string
}

// ─── Course ────────────────────────────────────────────────────────────────

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type CourseCategory = 'Design' | 'Engineering' | 'Marketing' | 'Data Science' | 'Product'

export interface Course {
  id: string
  emoji: string
  title: string
  description: string
  category: CourseCategory
  instructor: string
  instructorInitials: string
  instructorColor: string
  thumbBg: string
  lessons: number
  hours: number
  rating: number
  reviews: number
  students: number
  level: CourseLevel
  price: number
  tags: string[]
  modules: CourseModule[]
}

export interface CourseModule {
  title: string
  lessons: Lesson[]
  done?: boolean
  active?: boolean
}

export interface Lesson {
  title: string
  duration: string
  done?: boolean
  current?: boolean
}

// ─── Enrollment / Progress ────────────────────────────────────────────────

export interface CourseProgress {
  courseId: string
  userId: string
  progress: number          // 0–100
  currentModule: number
  totalModules: number
  lastStudied: string | null
  completedAt: string | null
}

// ─── Quiz ─────────────────────────────────────────────────────────────────

export type QuestionType = 'mcq' | 'truefalse' | 'short'

export interface Question {
  type: QuestionType
  question: string
  options?: string[]         // MCQ only
  correct: number | boolean | null  // null for short-answer (manual grading)
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  module: number
  description: string
  timeLimit: number          // minutes
  passMark: number           // percentage
  questions: Question[]
}

export interface QuizAttempt {
  quizId: string
  userId: string
  answers: Record<number, number | boolean | string>
  score: number
  passed: boolean
  startedAt: string
  submittedAt: string
}

// ─── Admin ────────────────────────────────────────────────────────────────

export interface PlatformStats {
  totalLearners: number
  monthlyRevenue: number
  completionRate: number
  newCoursesThisMonth: number
}

export interface RevenueBreakdown {
  plan: string
  amount: number
  percentage: number
}

// ─── UI helpers ───────────────────────────────────────────────────────────

/** Generic option for select/filter components */
export interface SelectOption<T extends string = string> {
  label: string
  value: T
}

/** Breadcrumb item */
export interface Breadcrumb {
  label: string
  href?: string
}

/** Metric card data */
export interface Metric {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
}
