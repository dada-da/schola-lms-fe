export interface Category {
  name: string
  displayName: string
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export const COURSE_STATUSES: CourseStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

export interface Course {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  price: number
  category: Category | string
  tags: string[]
  lessonCount: number
  totalDurationMinutes: number
  status?: CourseStatus | string
  createdAt: string
  updatedAt: string | null
}

export function normalizeCourseStatus(s: unknown): CourseStatus {
  if (s === 'PUBLISHED' || s === 'ARCHIVED') return s
  return 'DRAFT'
}

export interface CourseFormValues {
  title: string
  description: string
  thumbnailUrl: string
  price: number
  category: string
  tags: string[]
}

export function categoryName(c: Category | string | null | undefined): string {
  if (!c) return ''
  return typeof c === 'string' ? c : c.name
}

export function categoryLabel(c: Category | string | null | undefined, all: Category[]): string {
  if (!c) return ''
  if (typeof c === 'object') return c.displayName || c.name
  const match = all.find((x) => x.name === c)
  return match?.displayName ?? c
}

export type EnrollmentStatus = 'IN_PROGRESS' | 'COMPLETED'

export interface Enrollment {
  id: number
  studentId: number
  studentEmail: string
  courseId: number
  courseTitle: string
  status: EnrollmentStatus | string
  enrolledAt: string
  completedAt: string | null
}
