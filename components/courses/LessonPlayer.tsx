'use client'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { extractYouTubeId, type Lesson } from '@/components/manage-lessons/types'
import LessonTextContent from './LessonTextContent'
import LessonQuizContent from './LessonQuizContent'

interface Props {
  lesson: Lesson | null
  lessons: Lesson[]
  doneLessonIds: Set<number>
  onSelectLesson: (id: number) => void
  onToggleDone: (id: number) => void
  onLessonCompleted: (id: number) => void
}

export default function LessonPlayer({
  lesson,
  lessons,
  doneLessonIds,
  onSelectLesson,
  onToggleDone,
  onLessonCompleted,
}: Props) {
  const t = useTranslations('courseDetail')
  const idx = lesson ? lessons.findIndex((l) => l.id === lesson.id) : -1
  const hasPrev = idx > 0
  const hasNext = idx >= 0 && idx < lessons.length - 1

  return (
    <Card sx={{ mb: 2, overflow: 'hidden' }}>
      <PlayerSurface lesson={lesson} onLessonCompleted={onLessonCompleted} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, bgcolor: '#111827', flexWrap: 'wrap' }}>
        <Button
          size="small"
          sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }}
          variant="outlined"
          disabled={!hasPrev}
          onClick={() => {
            const prev = lessons[idx - 1]
            if (prev) onSelectLesson(prev.id)
          }}
        >
          {t('prevLesson')}
        </Button>
        <Box sx={{ flex: 1, px: 1, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', textAlign: 'center', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {lesson?.title ?? ''}
        </Box>
        {lesson && lesson.contentType !== 'QUIZ' && (
          doneLessonIds.has(lesson.id) ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<CheckCircleIcon />}
              onClick={() => onToggleDone(lesson.id)}
              sx={{ color: '#7cd1a8', borderColor: 'rgba(124,209,168,0.4)', '&:hover': { borderColor: '#7cd1a8', bgcolor: 'rgba(124,209,168,0.08)' } }}
            >
              {t('completedLesson')}
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onToggleDone(lesson.id)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }}
            >
              {t('markAsDone')}
            </Button>
          )
        )}
        {lesson && lesson.contentType === 'QUIZ' && doneLessonIds.has(lesson.id) && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#7cd1a8', fontSize: '0.78rem', px: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            {t('completedLesson')}
          </Box>
        )}
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={!hasNext}
          onClick={() => {
            const next = lessons[idx + 1]
            if (next) onSelectLesson(next.id)
          }}
        >
          {t('nextLesson')}
        </Button>
      </Box>
    </Card>
  )
}

function PlayerSurface({
  lesson,
  onLessonCompleted,
}: {
  lesson: Lesson | null
  onLessonCompleted: (id: number) => void
}) {
  if (!lesson) {
    return (
      <Box sx={{ height: { xs: 200, md: 280 }, bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3a5e 100%)' }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>—</Typography>
      </Box>
    )
  }

  if (lesson.contentType === 'QUIZ') {
    return <LessonQuizContent lesson={lesson} onCompleted={() => onLessonCompleted(lesson.id)} />
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

  return <LessonTextContent lesson={lesson} />
}
