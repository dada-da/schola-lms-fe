'use client'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CourseHeader from '@/components/courses/CourseHeader'
import LessonPlayer from '@/components/courses/LessonPlayer'
import CourseTabs from '@/components/courses/CourseTabs'
import CourseSidebar from '@/components/courses/CourseSidebar'
import type {
  Category,
  Course,
  Enrollment,
} from '@/components/manage-courses/types'
import { lessonCourseId, type Lesson } from '@/components/manage-lessons/types'

export default function CourseDetail() {
  const params = useParams<{ id: string }>()
  const t = useTranslations('courseDetail')

  const courseId = Number(params?.id)

  const [course, setCourse] = useState<Course | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  const [doneLessonIds, setDoneLessonIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!courseId) return
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [coursesRes, catsRes, lessonsRes, enrolRes] = await Promise.all([
        fetch('/api/course'),
        fetch('/api/category'),
        fetch(`/api/lesson?courseId=${courseId}`),
        fetch('/api/enrollment'),
      ])

      if (coursesRes.ok) {
        const data = await coursesRes.json()
        if (Array.isArray(data)) {
          const found = (data as Course[]).find((c) => c.id === courseId) ?? null
          setCourse(found)
          if (!found) setError(t('notFound'))
        }
      } else {
        setError(t('notFound'))
      }

      if (catsRes.ok) {
        const cats: Category[] = await catsRes.json()
        setCategories(Array.isArray(cats) ? cats : [])
      }

      if (lessonsRes.ok) {
        const data = await lessonsRes.json()
        const raw: unknown = Array.isArray(data)
          ? data
          : Array.isArray((data as { content?: unknown })?.content)
            ? (data as { content: unknown[] }).content
            : Array.isArray((data as { data?: unknown })?.data)
              ? (data as { data: unknown[] }).data
              : []
        const list = raw as Lesson[]
        const tagged = list.filter((l) => lessonCourseId(l) !== undefined)
        const scoped =
          tagged.length > 0
            ? tagged.filter((l) => lessonCourseId(l) === courseId)
            : list
        const sorted = [...scoped].sort((a, b) => a.sequence - b.sequence)
        setLessons(sorted)
        const first = sorted[0]
        if (first) setActiveLessonId((prev) => prev ?? first.id)
      }

      if (enrolRes.ok) {
        const en: Enrollment[] = await enrolRes.json()
        setEnrolled(
          Array.isArray(en) && en.some((e) => e.courseId === courseId)
        )
      }
    } catch {
      setError(t('notFound'))
    } finally {
      setLoading(false)
    }
  }

  async function handleEnroll() {
    if (!courseId) return
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      if (res.ok) setEnrolled(true)
    } finally {
      setEnrolling(false)
    }
  }

  function toggleDone(lessonId: number) {
    setDoneLessonIds((prev) => {
      const next = new Set(prev)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }

  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === activeLessonId) ?? lessons[0] ?? null,
    [lessons, activeLessonId]
  )

  const doneCount = useMemo(
    () => lessons.filter((l) => doneLessonIds.has(l.id)).length,
    [lessons, doneLessonIds]
  )
  const completionPct = lessons.length === 0 ? 0 : Math.round((doneCount / lessons.length) * 100)
  const remainingDuration = useMemo(
    () =>
      lessons
        .filter((l) => !doneLessonIds.has(l.id))
        .reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0),
    [lessons, doneLessonIds]
  )

  const totalDuration = useMemo(
    () => lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0),
    [lessons]
  )

  if (loading && !course) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  if (!course) {
    return (
      <DashboardLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error">{error || t('notFound')}</Alert>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <CourseHeader
        title={course.title}
        enrolled={enrolled}
        enrolling={enrolling}
        onEnroll={handleEnroll}
      />

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <LessonPlayer
              lesson={activeLesson}
              lessons={lessons}
              doneLessonIds={doneLessonIds}
              onSelectLesson={setActiveLessonId}
              onToggleDone={toggleDone}
            />

            <CourseTabs
              course={course}
              categories={categories}
              lessons={lessons}
              totalDuration={totalDuration}
              activeLessonId={activeLesson?.id ?? null}
              doneLessonIds={doneLessonIds}
              onSelectLesson={setActiveLessonId}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CourseSidebar
              lessons={lessons}
              doneLessonIds={doneLessonIds}
              activeLessonId={activeLesson?.id ?? null}
              doneCount={doneCount}
              completionPct={completionPct}
              remainingDuration={remainingDuration}
              onSelectLesson={setActiveLessonId}
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
