'use client'
import { useTranslations } from 'next-intl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import type { Lesson } from './types'

interface Props {
  lesson: Lesson
  onEdit: (l: Lesson) => void
  onDelete: (l: Lesson) => void
}

export default function LessonListItem({ lesson, onEdit, onDelete }: Props) {
  const t = useTranslations('manageLessons')
  const isVideo = lesson.contentType === 'VIDEO'
  const isQuiz = lesson.contentType === 'QUIZ'
  const typeLabel = isVideo
    ? t('contentTypeVideo')
    : isQuiz
      ? t('contentTypeQuiz')
      : t('contentTypeText')
  const TypeIcon = isVideo ? OndemandVideoOutlinedIcon : isQuiz ? QuizOutlinedIcon : ArticleOutlinedIcon

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: { xs: 1.25, sm: 2 },
          p: { xs: 1.5, sm: 2 },
          '&:last-child': { pb: { xs: 1.5, sm: 2 } },
        }}
      >
        <Box
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: 1.5,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.dark',
            flexShrink: 0,
          }}
        >
          <TypeIcon />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
            <Chip
              label={t('sequenceShort', { num: lesson.sequence })}
              size="small"
              color="primary"
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {lesson.title}
            </Typography>
          </Box>

          {lesson.description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {lesson.description}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block', mt: 0.75 }}
          >
            {typeLabel}
            {lesson.durationMinutes
              ? ` · ${t('duration', { minutes: lesson.durationMinutes })}`
              : ''}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
          <IconButton onClick={() => onEdit(lesson)} size="small" aria-label={t('editLesson')}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => onDelete(lesson)}
            size="small"
            color="error"
            aria-label={t('deleteLesson')}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}
