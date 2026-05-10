'use client'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import type { Lesson } from '@/components/manage-lessons/types'

interface Props {
  lessons: Lesson[]
  doneLessonIds: Set<number>
  activeLessonId: number | null
  doneCount: number
  completionPct: number
  remainingDuration: number
  onSelectLesson: (id: number) => void
}

export default function CourseSidebar({
  lessons,
  doneLessonIds,
  activeLessonId,
  doneCount,
  completionPct,
  remainingDuration,
  onSelectLesson,
}: Props) {
  const t = useTranslations('courseDetail')
  const tl = useTranslations('manageLessons')

  return (
    <>
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
      </CardContent></Card>

      <Card><CardContent>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{tl('title')}</Typography>
        {lessons.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tl('empty')}</Typography>
        ) : (
          lessons.map((l, i) => {
            const isActive = activeLessonId === l.id
            const isDone = doneLessonIds.has(l.id)
            return (
              <Box
                key={l.id}
                onClick={() => onSelectLesson(l.id)}
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
    </>
  )
}
