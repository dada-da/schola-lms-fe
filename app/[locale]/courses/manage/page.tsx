'use client'
import { useEffect, useState } from 'react'
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CourseFormDialog from '@/components/manage-courses/CourseFormDialog'
import CourseListItem from '@/components/manage-courses/CourseListItem'
import { categoryName } from '@/components/manage-courses/types'
import type { Category, Course, CourseFormValues } from '@/components/manage-courses/types'
import { useAuth } from '@/contexts/auth-context'

type DialogState = { mode: 'create' } | { mode: 'edit'; course: Course } | null

export default function ManageCoursesPage() {
  const t = useTranslations('manageCourses')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const isTeacher = user?.role?.toUpperCase() === 'TEACHER'

  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialog, setDialog] = useState<DialogState>(null)
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    if (!isTeacher) return
    void loadAll()
  }, [authLoading, user, isTeacher])

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [coursesRes, catsRes] = await Promise.all([
        fetch('/api/course'),
        fetch('/api/category'),
      ])
      if (!coursesRes.ok) {
        setError(t('loadFailed'))
      } else {
        const data: Course[] = await coursesRes.json()
        setCourses(Array.isArray(data) ? data : [])
      }
      if (catsRes.ok) {
        const cats: Category[] = await catsRes.json()
        setCategories(Array.isArray(cats) ? cats : [])
      }
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(values: CourseFormValues) {
    if (!dialog || !user) return
    const body = { ...values, userId: user.id }
    const url = dialog.mode === 'create' ? '/api/course' : `/api/course/${dialog.course.id}`
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
      const res = await fetch(`/api/course/${confirmDelete.id}`, { method: 'DELETE' })
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

  const editing = dialog?.mode === 'edit' ? dialog.course : null
  const initialValues: CourseFormValues | undefined = editing
    ? {
        title: editing.title ?? '',
        description: editing.description ?? '',
        thumbnailUrl: editing.thumbnailUrl ?? '',
        price: editing.price ?? 0,
        category: categoryName(editing.category),
        tags: Array.isArray(editing.tags) ? editing.tags : [],
      }
    : undefined

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
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
            {t('title')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('subtitle')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setDialog({ mode: 'create' })}
          sx={{ flexShrink: 0 }}
        >
          {t('createCourse')}
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
        ) : courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>📚</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {t('empty')}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {courses.map((c) => (
              <CourseListItem
                key={c.id}
                course={c}
                categories={categories}
                onEdit={(course) => setDialog({ mode: 'edit', course })}
                onDelete={setConfirmDelete}
              />
            ))}
          </Box>
        )}
      </Box>

      <CourseFormDialog
        open={dialog !== null}
        mode={dialog?.mode ?? 'create'}
        initialValues={initialValues}
        categories={categories}
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
