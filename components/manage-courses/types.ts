export interface Category {
  name: string
  displayName: string
}

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
  createdAt: string
  updatedAt: string | null
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
