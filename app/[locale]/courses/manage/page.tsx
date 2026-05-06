'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CourseFormDialog from '@/components/manage-courses/CourseFormDialog'
import CourseListItem from '@/components/manage-courses/CourseListItem'
import type { Category, Course, CourseFormValues } from '@/components/manage-courses/types'
import { useAuth } from '@/contexts/auth-context'

export default function ManageCoursesPage() {
  const t = useTranslations('manageCourses')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const isTeacher = user?.role?.toUpperCase() === 'TEACHER'

  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    if (!isTeacher) return
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function handleCreate(values: CourseFormValues) {
    if (!user) return
    const body = { ...values, userId: user.id }
    const res = await fetch('/api/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message ?? t('saveFailed'))
    }
    setCreateOpen(false)
    await loadAll()
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
          onClick={() => setCreateOpen(true)}
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
                onEdit={(course) => router.push(`/courses/manage/${course.id}`)}
              />
            ))}
          </Box>
        )}
      </Box>

      <CourseFormDialog
        open={createOpen}
        mode="create"
        categories={categories}
        onSave={handleCreate}
        onClose={() => setCreateOpen(false)}
      />
    </DashboardLayout>
  )
}
