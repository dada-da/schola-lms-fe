'use client'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import type { Course } from '@/lib/data'

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Design: { bg: '#e1f2ef', color: '#1f6257' },
  Engineering: { bg: '#e8f0fa', color: '#1d4f7a' },
  Marketing: { bg: '#faeaec', color: '#8a3040' },
  'Data Science': { bg: '#e8d5a8', color: '#6b4a0e' },
  Product: { bg: '#e1f2e8', color: '#1f6235' },
}

export default function CourseCard({ course, showProgress = false }: { course: Course; showProgress?: boolean }) {
  const router = useRouter()
  const catStyle = CAT_COLORS[course.category] ?? { bg: '#f0ede6', color: '#4a4a6a' }

  return (
    <Card
      onClick={() => router.push(`/courses/${course.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumb */}
      <Box
        sx={{
          height: 120,
          bgcolor: course.thumbBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          flexShrink: 0,
        }}
      >
        {course.emoji}
      </Box>

      <CardContent sx={{ p: 1.75, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Category */}
        <Chip
          label={course.category}
          size="small"
          sx={{ alignSelf: 'flex-start', bgcolor: catStyle.bg, color: catStyle.color, height: 20, fontSize: '0.62rem' }}
        />

        {/* Title */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.35, mt: 0.25 }}>
          {course.title}
        </Typography>

        {/* Instructor */}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {course.instructor}
        </Typography>

        {/* Rating + duration */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 'auto', pt: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <StarRateRoundedIcon sx={{ fontSize: 14, color: '#c8a96e' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#c8a96e' }}>{course.rating}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>({course.reviews})</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>{course.hours}h</Typography>
          </Box>
          {course.price === 0
            ? <Chip label="Free" size="small" sx={{ ml: 'auto', bgcolor: '#e1f2ef', color: '#1f6257', height: 18, fontSize: '0.6rem' }} />
            : <Typography variant="caption" sx={{ ml: 'auto', fontWeight: 600, color: 'secondary.main' }}>${course.price}</Typography>
          }
        </Box>

        {/* Progress bar (if enrolled) */}
        {showProgress && course.progress > 0 && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Progress</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{course.progress}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={course.progress} color="primary" />
          </Box>
        )}
        {showProgress && course.progress === 100 && (
          <Chip label="Completed ✓" size="small" color="success" sx={{ mt: 1, alignSelf: 'flex-start', height: 20, fontSize: '0.62rem' }} />
        )}
      </CardContent>
    </Card>
  )
}
