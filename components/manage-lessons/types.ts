export type ContentType = 'TEXT' | 'VIDEO'

export interface Lesson {
  id: number
  title: string
  description: string | null
  sequence: number
  durationMinutes: number | null
  content: string
  contentType: ContentType
  status?: string
  courseId?: number
  course?: { id: number } | null
  createdAt?: string
  updatedAt?: string | null
}

export function lessonCourseId(l: Lesson): number | undefined {
  return l.courseId ?? l.course?.id
}

export interface LessonFormValues {
  title: string
  description: string
  sequence: number
  durationMinutes: number
  content: string
  contentType: ContentType
}

const YOUTUBE_RE =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/

export function extractYouTubeId(url: string): string | null {
  const m = url.match(YOUTUBE_RE)
  return m?.[1] ?? null
}
