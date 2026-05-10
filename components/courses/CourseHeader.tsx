'use client'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from '@/i18n/navigation'

interface Props {
  title: string
  enrolled: boolean
  enrolling: boolean
  onEnroll: () => void
}

export default function CourseHeader({ title, enrolled, enrolling, onEnroll }: Props) {
  const router = useRouter()
  const t = useTranslations('courseDetail')
  const tcourses = useTranslations('courses')

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, position: 'sticky', top: 0, zIndex: 40 }}>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, mb: 0.25 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push('/dashboard')}>{t('dashboard')}</Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>›</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push('/courses')}>{t('courses')}</Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>›</Typography>
          <Typography variant="caption" noWrap>{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} noWrap>{title}</Typography>
      </Box>
      {!enrolled && (
        <Button variant="contained" color="primary" size="small" sx={{ flexShrink: 0 }} disabled={enrolling} onClick={onEnroll}>
          {enrolling ? <CircularProgress size={16} color="inherit" /> : tcourses('enroll')}
        </Button>
      )}
    </Box>
  )
}
