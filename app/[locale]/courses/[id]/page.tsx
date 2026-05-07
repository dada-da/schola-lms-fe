'use client'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  categoryLabel,
  type Category,
  type Course,
  type Enrollment,
} from '@/components/manage-courses/types'
import {
  extractYouTubeId,
  lessonCourseId,
  type Lesson,
} from '@/components/manage-lessons/types'

const DISCUSSIONS = [
  { initials: 'SM', name: 'Sarah M.', color: '#2d8a7a', time: '2 hours ago', text: 'The section on avoiding bias was really eye-opening. I had no idea I was leading participants without realizing it.', likes: 12 },
  { initials: 'JT', name: 'James T.', color: '#3a6ea8', time: 'Yesterday', text: 'The framework for synthesizing interview data is the clearest I\'ve seen.', likes: 8 },
]
const RESOURCES = [
  { icon: '📄', name: 'Research Plan Template', type: 'PDF', size: '1.2 MB', bg: '#faeaec' },
  { icon: '📊', name: 'Interview Debrief Spreadsheet', type: 'XLSX', size: '540 KB', bg: '#e1f2e8' },
]

export default function CourseDetail() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const t = useTranslations('courseDetail')
  const tc = useTranslations('common')
  const tl = useTranslations('manageLessons')
  const tcourses = useTranslations('courses')

  const courseId = Number(params?.id)

  const [course, setCourse] = useState<Course | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
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
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, position: 'sticky', top: 0, zIndex: 40 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, mb: 0.25 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push('/dashboard')}>{t('dashboard')}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>›</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push('/courses')}>{t('courses')}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>›</Typography>
            <Typography variant="caption" noWrap>{course.title}</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} noWrap>{course.title}</Typography>
        </Box>
        {enrolled ? (
          <Button variant="contained" color="primary" size="small" sx={{ flexShrink: 0 }} onClick={() => router.push(`/quiz/${course.id}`)}>{t('takeQuiz')}</Button>
        ) : (
          <Button variant="contained" color="primary" size="small" sx={{ flexShrink: 0 }} disabled={enrolling} onClick={handleEnroll}>
            {enrolling ? <CircularProgress size={16} color="inherit" /> : tcourses('enroll')}
          </Button>
        )}
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 2, overflow: 'hidden' }}>
              <LessonPlayer lesson={activeLesson} takeQuizLabel={t('takeQuiz')} onTakeQuiz={() => router.push(`/quiz/${courseId}`)} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, bgcolor: '#111827', flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}
                  variant="outlined"
                  disabled={!activeLesson || lessons.findIndex((l) => l.id === activeLesson.id) <= 0}
                  onClick={() => {
                    if (!activeLesson) return
                    const idx = lessons.findIndex((l) => l.id === activeLesson.id)
                    const prev = idx > 0 ? lessons[idx - 1] : null
                    if (prev) setActiveLessonId(prev.id)
                  }}
                >
                  {t('prevLesson')}
                </Button>
                <Box sx={{ flex: 1, px: 1, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', textAlign: 'center', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeLesson?.title ?? ''}
                </Box>
                {activeLesson && (
                  doneLessonIds.has(activeLesson.id) ? (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => toggleDone(activeLesson.id)}
                      sx={{ color: '#7cd1a8', borderColor: 'rgba(124,209,168,0.4)', '&:hover': { borderColor: '#7cd1a8', bgcolor: 'rgba(124,209,168,0.08)' } }}
                    >
                      {t('completedLesson')}
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleDone(activeLesson.id)}
                      sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
                    >
                      {t('markAsDone')}
                    </Button>
                  )
                )}
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={!activeLesson || lessons.findIndex((l) => l.id === activeLesson.id) >= lessons.length - 1}
                  onClick={() => {
                    if (!activeLesson) return
                    const idx = lessons.findIndex((l) => l.id === activeLesson.id)
                    const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null
                    if (next) setActiveLessonId(next.id)
                  }}
                >
                  {t('nextLesson')}
                </Button>
              </Box>
            </Card>

            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              {[t('overview'), t('curriculum'), t('discussion'), t('resources')].map(label => <Tab key={label} label={label} />)}
            </Tabs>

            {activeTab === 0 && (
              <Card><CardContent>
                <Typography variant="h5" sx={{ mb: 1 }}>{course.title}</Typography>
                {course.description && (
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>{course.description}</Typography>
                )}
                {course.tags && course.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                    {course.tags.map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                  {course.category && (
                    <Chip label={categoryLabel(course.category, categories)} size="small" sx={{ bgcolor: '#e1f2ef', color: '#1f6257' }} />
                  )}
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {tl('lessons', { count: lessons.length })}
                  </Typography>
                  {totalDuration > 0 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {tl('duration', { minutes: totalDuration })}
                    </Typography>
                  )}
                </Box>
              </CardContent></Card>
            )}

            {activeTab === 1 && (
              <Card>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  {lessons.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                      <Typography sx={{ fontSize: '2rem', mb: 1 }}>📖</Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>{tl('empty')}</Typography>
                    </Box>
                  ) : (
                    lessons.map((l, i) => {
                      const isActive = activeLesson?.id === l.id
                      const isDone = doneLessonIds.has(l.id)
                      const TypeIcon =
                        l.contentType === 'VIDEO'
                          ? OndemandVideoOutlinedIcon
                          : l.contentType === 'QUIZ'
                            ? QuizOutlinedIcon
                            : ArticleOutlinedIcon
                      return (
                        <Box
                          key={l.id}
                          onClick={() => setActiveLessonId(l.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            px: 2,
                            py: 1.25,
                            borderTop: i === 0 ? 'none' : '1px solid',
                            borderColor: 'divider',
                            bgcolor: isActive ? 'primary.light' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: isActive ? 'primary.light' : 'background.default' },
                          }}
                        >
                          {isDone ? (
                            <CheckCircleIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
                          ) : isActive ? (
                            <PlayCircleOutlineIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
                          ) : (
                            <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: 'text.disabled', flexShrink: 0 }} />
                          )}
                          <Chip
                            label={tl('sequenceShort', { num: l.sequence })}
                            size="small"
                            sx={{ height: 20, fontSize: '0.62rem', flexShrink: 0 }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'primary.dark' : 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {l.title}
                            </Typography>
                            {l.description && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {l.description}
                              </Typography>
                            )}
                          </Box>
                          <TypeIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />
                          {l.durationMinutes ? (
                            <Typography variant="caption" sx={{ color: 'text.disabled', flexShrink: 0 }}>
                              {tl('duration', { minutes: l.durationMinutes })}
                            </Typography>
                          ) : null}
                        </Box>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 2 && (
              <Card><CardContent>
                {DISCUSSIONS.map((d, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, py: 1.5, borderBottom: i < DISCUSSIONS.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: d.color, fontSize: '0.72rem', fontWeight: 600, flexShrink: 0 }}>{d.initials}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.4 }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>{d.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{d.time}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, mb: 0.75 }}>{d.text}</Typography>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>👍 {d.likes}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{tc('reply')}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <TextField multiline rows={3} fullWidth placeholder={t('addComment')} size="small" sx={{ mb: 1 }} />
                  <Button variant="contained" color="primary" size="small">{tc('postComment')}</Button>
                </Box>
              </CardContent></Card>
            )}

            {activeTab === 3 && (
              <Card><CardContent>
                {RESOURCES.map((r, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: i < RESOURCES.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: 1.5, bgcolor: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.type} · {r.size}</Typography>
                    </Box>
                    <Button variant="outlined" color="secondary" size="small">↓ {tc('download')}</Button>
                  </Box>
                ))}
              </CardContent></Card>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2 }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('yourProgress')}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('overallCompletion')}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{completionPct}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={completionPct} sx={{ mb: 2 }} color="primary" />
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {[
                  { n: doneCount, l: t('lessonsDone') },
                  { n: lessons.length, l: t('total') },
                  { n: remainingDuration > 0 ? tl('duration', { minutes: remainingDuration }) : '—', l: t('remaining') },
                ].map((s) => (
                  <Grid item xs={4} key={s.l}>
                    <Box sx={{ bgcolor: 'background.default', borderRadius: 1.5, p: 1, textAlign: 'center' }}>
                      <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.25rem' }}>{s.n}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button fullWidth variant="contained" color="primary" onClick={() => router.push(`/quiz/${course.id}`)}>{t('takeModuleQuiz')}</Button>
            </CardContent></Card>

            <Card><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{tl('title')}</Typography>
              {lessons.length === 0 ? (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tl('empty')}</Typography>
              ) : (
                lessons.map((l, i) => {
                  const isActive = activeLesson?.id === l.id
                  const isDone = doneLessonIds.has(l.id)
                  return (
                    <Box
                      key={l.id}
                      onClick={() => setActiveLessonId(l.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.75,
                        borderBottom: i < lessons.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover .lesson-title': { color: 'primary.main' },
                      }}
                    >
                      {isDone ? (
                        <CheckCircleIcon sx={{ fontSize: 14, color: 'primary.main', flexShrink: 0 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            flexShrink: 0,
                            bgcolor: isActive ? 'transparent' : 'divider',
                            border: isActive ? '2px solid' : 'none',
                            borderColor: isActive ? 'primary.main' : 'transparent',
                            boxShadow: isActive ? '0 0 0 3px #e1f2ef' : 'none',
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          className="lesson-title"
                          variant="body2"
                          sx={{
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'primary.dark' : 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {l.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {l.contentType === 'VIDEO'
                            ? tl('contentTypeVideo')
                            : l.contentType === 'QUIZ'
                              ? tl('contentTypeQuiz')
                              : tl('contentTypeText')}
                          {l.durationMinutes ? ` · ${tl('duration', { minutes: l.durationMinutes })}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })
              )}
            </CardContent></Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}

function LessonPlayer({
  lesson,
  takeQuizLabel,
  onTakeQuiz,
}: {
  lesson: Lesson | null
  takeQuizLabel: string
  onTakeQuiz: () => void
}) {
  if (!lesson) {
    return (
      <Box sx={{ height: { xs: 200, md: 280 }, bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3a5e 100%)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>—</Typography>
      </Box>
    )
  }

  if (lesson.contentType === 'QUIZ') {
    return (
      <Box sx={{ height: { xs: 220, md: 300 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, p: 3, background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3a5e 100%)', textAlign: 'center' }}>
        <Typography sx={{ fontSize: '2.5rem' }}>📝</Typography>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{lesson.title}</Typography>
        {lesson.description && (
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480 }}>{lesson.description}</Typography>
        )}
        <Button variant="contained" color="primary" onClick={onTakeQuiz} sx={{ mt: 1 }}>
          {takeQuizLabel}
        </Button>
      </Box>
    )
  }

  if (lesson.contentType === 'VIDEO') {
    const youTubeId = extractYouTubeId(lesson.content || '')
    if (youTubeId) {
      return (
        <Box sx={{ position: 'relative', width: '100%', pb: '56.25%', bgcolor: '#000' }}>
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${youTubeId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </Box>
      )
    }
    return (
      <Box sx={{ height: { xs: 200, md: 280 }, bgcolor: 'secondary.main', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3a5e 100%)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{lesson.title}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>Video unavailable</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>{lesson.title}</Typography>
      {lesson.description && (
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>{lesson.description}</Typography>
      )}
      <Box
        sx={{
          color: 'text.primary',
          lineHeight: 1.75,
          '& p': { my: 1 },
          '& ul, & ol': { pl: 3, my: 1 },
          '& a': { color: 'primary.main' },
          '& code': { bgcolor: 'background.default', px: 0.5, borderRadius: 0.5, fontSize: '0.85em' },
          '& pre': { bgcolor: 'background.default', p: 1.5, borderRadius: 1, overflowX: 'auto' },
          '& blockquote': { borderLeft: '3px solid', borderColor: 'divider', pl: 2, color: 'text.secondary', my: 1 },
          '& img': { display: 'block', maxWidth: '100%', height: 'auto', borderRadius: 1, my: 1.5, mx: 'auto' },
          '& figure': { m: 0, my: 1.5 },
          '& iframe, & video': { display: 'block', maxWidth: '100%', borderRadius: 1, my: 1.5 },
        }}
        dangerouslySetInnerHTML={{ __html: lesson.content || '' }}
      />
    </Box>
  )
}
