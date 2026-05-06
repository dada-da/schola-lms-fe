'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CourseEditCard from '@/components/manage-courses/CourseEditCard'
import CourseStatusButton from '@/components/manage-courses/CourseStatusButton'
import { categoryName } from '@/components/manage-courses/types'
import type {
  Category,
  Course,
  CourseFormValues,
  CourseStatus,
} from '@/components/manage-courses/types'
import LessonFormDialog from '@/components/manage-lessons/LessonFormDialog'
import LessonListItem from '@/components/manage-lessons/LessonListItem'
import {
  lessonCourseId,
  type Lesson,
  type LessonFormValues,
} from '@/components/manage-lessons/types'
import { useAuth } from '@/contexts/auth-context'

type LessonDialogState =
  | { mode: 'create' }
  | { mode: 'edit'; lesson: Lesson }
  | null

export default function ManageCourseDetailPage() {
  const t = useTranslations('manageCourses')
  const tl = useTranslations('manageLessons')
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const courseId = Number(params?.id)
  const { user, loading: authLoading } = useAuth()
  const isTeacher = user?.role?.toUpperCase() === 'TEACHER'

  const [course, setCourse] = useState<Course | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lessonDialog, setLessonDialog] = useState<LessonDialogState>(null)
  const [confirmDelete, setConfirmDelete] = useState<Lesson | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    if (!isTeacher || !courseId) return
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, isTeacher, courseId])

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [coursesRes, catsRes, lessonsRes] = await Promise.all([
        fetch('/api/course'),
        fetch('/api/category'),
        fetch(`/api/lesson?courseId=${courseId}`),
      ])

      if (!coursesRes.ok) {
        setError(t('loadFailed'))
      } else {
        const courses = await coursesRes.json()
        if (Array.isArray(courses)) {
          const found = courses.find((c: Course) => c.id === courseId) ?? null
          setCourse(found)
          if (!found) setError(t('notFound'))
        }
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
        setLessons([...scoped].sort((a, b) => a.sequence - b.sequence))
      }
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveCourse(values: CourseFormValues) {
    if (!user) return
    const body = { ...values, userId: user.id }
    const res = await fetch(`/api/course/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message ?? t('saveFailed'))
    }
    await loadAll()
  }

  async function handleChangeStatus(status: CourseStatus) {
    if (!user) return
    setError('')
    const body = { status, userId: user.id }
    const res = await fetch(`/api/course/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      setError(err?.message ?? t('statusUpdateFailed'))
      return
    }
    setCourse((prev) => (prev ? { ...prev, status } : prev))
  }

  async function handleSaveLesson(values: LessonFormValues) {
    if (!lessonDialog) return
    const body = { ...values, courseId }
    const url =
      lessonDialog.mode === 'create'
        ? '/api/lesson'
        : `/api/lesson/${lessonDialog.lesson.id}`
    const method = lessonDialog.mode === 'create' ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message ?? tl('saveFailed'))
    }
    setLessonDialog(null)
    await loadAll()
  }

  async function handleDeleteLesson() {
    if (!confirmDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/lesson/${confirmDelete.id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error()
      setConfirmDelete(null)
      await loadAll()
    } catch {
      setDeleteError(tl('deleteFailed'))
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || (loading && !course)) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  if (!isTeacher) {
    return (
      <DashboardLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="warning">{t('forbidden')}</Alert>
        </Box>
      </DashboardLayout>
    )
  }

  if (!courseId || (!course && !loading)) {
    return (
      <DashboardLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error">{error || t('notFound')}</Alert>
          <Button
            sx={{ mt: 2 }}
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/courses/manage')}
          >
            {tl('back')}
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  const editingLesson =
    lessonDialog?.mode === 'edit' ? lessonDialog.lesson : null
  const lessonInitialValues: LessonFormValues | undefined = editingLesson
    ? {
        title: editingLesson.title ?? '',
        description: editingLesson.description ?? '',
        sequence: editingLesson.sequence ?? 1,
        durationMinutes: editingLesson.durationMinutes ?? 0,
        content: editingLesson.content ?? '',
        contentType: editingLesson.contentType ?? 'TEXT',
      }
    : undefined
  const nextSequence =
    lessons.length === 0 ? 1 : Math.max(...lessons.map((l) => l.sequence)) + 1

  const courseFormInitial: CourseFormValues | null = course
    ? {
        title: course.title ?? '',
        description: course.description ?? '',
        thumbnailUrl: course.thumbnailUrl ?? '',
        price: course.price ?? 0,
        category: categoryName(course.category),
        tags: Array.isArray(course.tags) ? course.tags : [],
      }
    : null

  return (
    <DashboardLayout>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <IconButton
          size="small"
          onClick={() => router.push('/courses/manage')}
          aria-label={tl('back')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
            {t('editCourse')}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {course?.title || t('subtitle')}
          </Typography>
        </Box>
        {course && (
          <CourseStatusButton
            status={course.status}
            onChange={handleChangeStatus}
          />
        )}
      </Box>

      <Box
        sx={{
          p: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}

        {courseFormInitial && (
          <CourseEditCard
            initialValues={courseFormInitial}
            categories={categories}
            onSave={handleSaveCourse}
          />
        )}

        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                {tl('title')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {tl('subtitle')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setLessonDialog({ mode: 'create' })}
              sx={{ flexShrink: 0 }}
            >
              {tl('createLesson')}
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : lessons.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>📖</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {tl('empty')}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {lessons.map((l) => (
                <LessonListItem
                  key={l.id}
                  lesson={l}
                  onEdit={(lesson) => setLessonDialog({ mode: 'edit', lesson })}
                  onDelete={setConfirmDelete}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <LessonFormDialog
        open={lessonDialog !== null}
        mode={lessonDialog?.mode ?? 'create'}
        initialValues={lessonInitialValues}
        defaultSequence={nextSequence}
        onSave={handleSaveLesson}
        onClose={() => setLessonDialog(null)}
      />

      <Dialog
        open={confirmDelete !== null}
        onClose={() => !deleting && setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{tl('deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography variant="body2">
            {confirmDelete && tl('deleteConfirmBody', { title: confirmDelete.title })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} disabled={deleting}>
            {tl('cancel')}
          </Button>
          <Button
            onClick={handleDeleteLesson}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : tl('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
