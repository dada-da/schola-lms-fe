'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import { categoryLabel, type Category, type Course } from '@/components/manage-courses/types'
import type { Lesson } from '@/components/manage-lessons/types'

const DISCUSSIONS = [
  { initials: 'SM', name: 'Sarah M.', color: '#2d8a7a', time: '2 hours ago', text: 'The section on avoiding bias was really eye-opening. I had no idea I was leading participants without realizing it.', likes: 12 },
  { initials: 'JT', name: 'James T.', color: '#3a6ea8', time: 'Yesterday', text: 'The framework for synthesizing interview data is the clearest I\'ve seen.', likes: 8 },
]
const RESOURCES = [
  { icon: '📄', name: 'Research Plan Template', type: 'PDF', size: '1.2 MB', bg: '#faeaec' },
  { icon: '📊', name: 'Interview Debrief Spreadsheet', type: 'XLSX', size: '540 KB', bg: '#e1f2e8' },
]

interface Props {
  course: Course
  categories: Category[]
  lessons: Lesson[]
  totalDuration: number
  activeLessonId: number | null
  doneLessonIds: Set<number>
  onSelectLesson: (id: number) => void
}

export default function CourseTabs({
  course,
  categories,
  lessons,
  totalDuration,
  activeLessonId,
  doneLessonIds,
  onSelectLesson,
}: Props) {
  const t = useTranslations('courseDetail')
  const tc = useTranslations('common')
  const tl = useTranslations('manageLessons')
  const [activeTab, setActiveTab] = useState(0)

  const labels = [t('overview'), t('curriculum'), t('discussion'), t('resources')]

  return (
    <>
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        {labels.map((label) => <Tab key={label} label={label} />)}
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
                const isActive = activeLessonId === l.id
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
                    onClick={() => onSelectLesson(l.id)}
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
    </>
  )
}
