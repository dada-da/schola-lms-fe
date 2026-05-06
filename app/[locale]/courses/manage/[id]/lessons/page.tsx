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
import LessonFormDialog from '@/components/manage-lessons/LessonFormDialog'
import LessonListItem from '@/components/manage-lessons/LessonListItem'
import { lessonCourseId, type Lesson, type LessonFormValues } from '@/components/manage-lessons/types'
import { useAuth } from '@/contexts/auth-context'

type DialogState = { mode: 'create' } | { mode: 'edit'; lesson: Lesson } | null

export default function ManageLessonsPage() {
  const t = useTranslations('manageLessons')
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const courseId = Number(params?.id)
  const { user, loading: authLoading } = useAuth()
  const isTeacher = user?.role?.toUpperCase() === 'TEACHER'

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [courseTitle, setCourseTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialog, setDialog] = useState<DialogState>(null)
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
      const [lessonsRes, courseRes] = await Promise.all([
        fetch(`/api/lesson?courseId=${courseId}`),
        fetch('/api/course'),
      ])
      if (!lessonsRes.ok) {
        setError(t('loadFailed'))
      } else {
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
      if (courseRes.ok) {
        const courses = await courseRes.json()
        if (Array.isArray(courses)) {
          const found = courses.find((c: { id: number }) => c.id === courseId)
          if (found) setCourseTitle(found.title ?? '')
        }
      }
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(values: LessonFormValues) {
    if (!dialog) return
    const body = { ...values, courseId }
    const url = dialog.mode === 'create' ? '/api/lesson' : `/api/lesson/${dialog.lesson.id}`
    const method = dialog.mode === 'create' ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message ?? t('saveFailed'))
    }
    setDialog(null)
    await loadAll()
  }

  async function handleDelete() {
    if (!confirmDelete) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/lesson/${confirmDelete.id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error()
      setConfirmDelete(null)
      await loadAll()
    } catch {
      setDeleteError(t('deleteFailed'))
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading) {
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

  if (!courseId) {
    return (
      <DashboardLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="error">{t('invalidCourse')}</Alert>
        </Box>
      </DashboardLayout>
    )
  }

  const editing = dialog?.mode === 'edit' ? dialog.lesson : null
  const initialValues: LessonFormValues | undefined = editing
    ? {
        title: editing.title ?? '',
        description: editing.description ?? '',
        sequence: editing.sequence ?? 1,
        durationMinutes: editing.durationMinutes ?? 0,
        content: editing.content ?? '',
        contentType: editing.contentType ?? 'TEXT',
      }
    : undefined
  const nextSequence =
    lessons.length === 0 ? 1 : Math.max(...lessons.map((l) => l.sequence)) + 1

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
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <IconButton
            size="small"
            onClick={() => router.push('/courses/manage')}
            aria-label={t('back')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
              {t('title')}
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
              {courseTitle || t('subtitle')}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setDialog({ mode: 'create' })}
          sx={{ flexShrink: 0 }}
        >
          {t('createLesson')}
        </Button>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : lessons.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>📖</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('empty')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {lessons.map((l) => (
              <LessonListItem
                key={l.id}
                lesson={l}
                onEdit={(lesson) => setDialog({ mode: 'edit', lesson })}
                onDelete={setConfirmDelete}
              />
            ))}
          </Box>
        )}
      </Box>

      <LessonFormDialog
        open={dialog !== null}
        mode={dialog?.mode ?? 'create'}
        initialValues={initialValues}
        defaultSequence={nextSequence}
        onSave={handleSave}
        onClose={() => setDialog(null)}
      />

      <Dialog
        open={confirmDelete !== null}
        onClose={() => !deleting && setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography variant="body2">
            {confirmDelete && t('deleteConfirmBody', { title: confirmDelete.title })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} disabled={deleting}>
            {t('cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
