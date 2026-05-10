'use client'
import { useTranslations } from 'next-intl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import type { Lesson, LessonStatus } from './types'

interface Props {
  lesson: Lesson
  onEdit: (l: Lesson) => void
  onDelete: (l: Lesson) => void
  onManageQuiz?: (l: Lesson) => void
  onToggleStatus?: (l: Lesson, next: LessonStatus) => void
}

export default function LessonListItem({
  lesson,
  onEdit,
  onDelete,
  onManageQuiz,
  onToggleStatus,
}: Props) {
  const t = useTranslations('manageLessons')
  const isVideo = lesson.contentType === 'VIDEO'
  const isQuiz = lesson.contentType === 'QUIZ'
  const typeLabel = isVideo
    ? t('contentTypeVideo')
    : isQuiz
      ? t('contentTypeQuiz')
      : t('contentTypeText')
  const TypeIcon = isVideo ? OndemandVideoOutlinedIcon : isQuiz ? QuizOutlinedIcon : ArticleOutlinedIcon

  const status = lesson.status ?? 'DRAFT'
  const isPublished = status === 'PUBLISHED'
  const statusChipColor: 'success' | 'default' | 'warning' =
    status === 'PUBLISHED' ? 'success' : status === 'ARCHIVED' ? 'warning' : 'default'
  const statusLabel =
    status === 'PUBLISHED'
      ? t('statusPublished')
      : status === 'ARCHIVED'
        ? t('statusArchived')
        : t('statusDraft')

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
            <Chip
              label={statusLabel}
              size="small"
              color={statusChipColor}
              variant={isPublished ? 'filled' : 'outlined'}
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 500 }}
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

          {isQuiz && onManageQuiz && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<QuizOutlinedIcon />}
                onClick={() => onManageQuiz(lesson)}
              >
                {t('manageQuiz')}
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
          {onToggleStatus && (
            <Tooltip title={isPublished ? t('unpublishLesson') : t('publishLesson')}>
              <IconButton
                onClick={() =>
                  onToggleStatus(lesson, isPublished ? 'DRAFT' : 'PUBLISHED')
                }
                size="small"
                color={isPublished ? 'success' : 'default'}
                aria-label={isPublished ? t('unpublishLesson') : t('publishLesson')}
              >
                {isPublished ? (
                  <CloudOffOutlinedIcon fontSize="small" />
                ) : (
                  <CloudUploadOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
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
