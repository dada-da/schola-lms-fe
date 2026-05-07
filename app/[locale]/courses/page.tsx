'use client'
import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/auth-context'
import {
  categoryLabel,
  type Category,
  type Course,
  type Enrollment,
} from '@/components/manage-courses/types'

export default function CoursesPage() {
  const t = useTranslations('courses')
  const tc = useTranslations('common')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [tab, setTab] = useState(0)
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [coursesRes, catsRes, enrolRes] = await Promise.all([
        fetch('/api/course'),
        fetch('/api/category'),
        fetch('/api/enrollment'),
      ])
      if (coursesRes.ok) {
        const data: Course[] = await coursesRes.json()
        setCourses(Array.isArray(data) ? data : [])
      } else {
        setError(t('loadFailed'))
      }
      if (catsRes.ok) {
        const cats: Category[] = await catsRes.json()
        setCategories(Array.isArray(cats) ? cats : [])
      }
      if (enrolRes.ok) {
        const en: Enrollment[] = await enrolRes.json()
        setEnrollments(Array.isArray(en) ? en : [])
      }
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleEnroll(courseId: number) {
    setEnrollingId(courseId)
    try {
      const res = await fetch('/api/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setToast(data?.message ?? t('enrollFailed'))
        return
      }
      const enrollment = data as Enrollment
      setEnrollments((prev) =>
        prev.some((e) => e.courseId === enrollment.courseId)
          ? prev
          : [...prev, enrollment]
      )
      setToast(t('enrolledToast', { title: enrollment.courseTitle }))
    } catch {
      setToast(t('enrollFailed'))
    } finally {
      setEnrollingId(null)
    }
  }

  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((e) => e.courseId)),
    [enrollments]
  )

  const filtered = useMemo(() => {
    let list = tab === 1 ? courses.filter((c) => enrolledCourseIds.has(c.id)) : courses
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q) ||
          (c.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      )
    }
    return list
  }, [tab, courses, enrolledCourseIds, search])

  const enrolledCount = enrollments.length

  return (
    <DashboardLayout>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
          {t('title')}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('coursesAvailable', { count: courses.length, enrolled: enrolledCount })}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab label={t('allCourses')} />
          <Tab label={t('myCourses', { count: enrolledCount })} />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder={t('searchPlaceholder')}
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: '1 1 220px', maxWidth: 320 }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
            <Typography variant="h6">{t('noCoursesFound')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {t('noCoursesHint')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {filtered.map((c) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                <CourseEnrollCard
                  course={c}
                  categories={categories}
                  enrolled={enrolledCourseIds.has(c.id)}
                  enrolling={enrollingId === c.id}
                  onEnroll={() => handleEnroll(c.id)}
                  onOpen={() => router.push(`/courses/${c.id}`)}
                  freeLabel={tc('free')}
                  enrolledLabel={t('enrolled')}
                  enrollLabel={t('enroll')}
                  enrollingLabel={t('enrolling')}
                  continueLabel={t('continueLearningBtn')}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </DashboardLayout>
  )
}

interface EnrollCardProps {
  course: Course
  categories: Category[]
  enrolled: boolean
  enrolling: boolean
  onEnroll: () => void
  onOpen: () => void
  freeLabel: string
  enrolledLabel: string
  enrollLabel: string
  enrollingLabel: string
  continueLabel: string
}

function CourseEnrollCard({
  course,
  categories,
  enrolled,
  enrolling,
  onEnroll,
  onOpen,
  freeLabel,
  enrolledLabel,
  enrollLabel,
  enrollingLabel,
  continueLabel,
}: EnrollCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 },
      }}
    >
      {course.thumbnailUrl ? (
        <Box
          component="img"
          src={course.thumbnailUrl}
          alt=""
          onClick={onOpen}
          sx={{
            height: 120,
            width: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
            bgcolor: 'background.default',
            flexShrink: 0,
          }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
          }}
        />
      ) : (
        <Box
          onClick={onOpen}
          sx={{
            height: 120,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          📚
        </Box>
      )}
      <CardContent sx={{ p: 1.75, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
          {course.category && (
            <Chip
              label={categoryLabel(course.category, categories)}
              size="small"
              sx={{ height: 20, fontSize: '0.62rem' }}
            />
          )}
          {enrolled && (
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
              label={enrolledLabel}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.62rem' }}
            />
          )}
        </Box>
        <Typography
          variant="subtitle2"
          onClick={onOpen}
          sx={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.35, cursor: 'pointer' }}
        >
          {course.title}
        </Typography>
        {course.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {course.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto', pt: 0.5 }}>
          {course.price > 0 ? (
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'secondary.main' }}>
              ${Number(course.price).toFixed(2)}
            </Typography>
          ) : (
            <Chip
              label={freeLabel}
              size="small"
              sx={{ bgcolor: '#e1f2ef', color: '#1f6257', height: 18, fontSize: '0.6rem' }}
            />
          )}
          <Box sx={{ ml: 'auto' }}>
            {enrolled ? (
              <Button size="small" variant="outlined" onClick={onOpen}>
                {continueLabel}
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                disabled={enrolling}
                onClick={onEnroll}
              >
                {enrolling ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  enrollLabel
                )}
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
