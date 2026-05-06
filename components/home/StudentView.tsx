'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DashboardLayout from '@/components/layout/DashboardLayout'
import RoleHeader from '@/components/home/RoleHeader'
import type { AuthUser } from '@/contexts/auth-context'
import { COURSES } from '@/lib/data'

export default function StudentView({ user }: { user: AuthUser }) {
  const router = useRouter()
  const t = useTranslations('home.student')

  const inProgress = COURSES.filter((c: any) => c.progress > 0 && c.progress < 100)

  const METRICS = [
    { label: t('hoursThisWeek'), value: '14.5h', icon: '⏱' },
    { label: t('coursesInProgress'), value: '4', icon: '📚' },
    { label: t('avgScore'), value: '87%', icon: '🎯' },
    { label: t('dayStreak'), value: '23 🔥', icon: '🔥' },
  ]

  return (
    <DashboardLayout>
      <RoleHeader user={user} subtitle={t('subtitle')} />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {METRICS.map(m => (
            <Grid item xs={6} md={3} key={m.label}>
              <Card>
                <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                  <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>{m.label}</Typography>
                  <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '2rem', lineHeight: 1.1 }}>{m.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2">{t('continueLearning')}</Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => router.push('/courses')}>
                {t('seeAll')} →
              </Typography>
            </Box>
            {inProgress.slice(0, 4).map((c: any, i: number) => (
              <Box
                key={c.id}
                onClick={() => router.push(`/courses/${c.id}`)}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: i < Math.min(inProgress.length, 4) - 1 ? '1px solid' : 'none', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'background.default', mx: -2, px: 2, borderRadius: 1 } }}
              >
                <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{c.emoji}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{c.instructor}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 72 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{c.progress}%</Typography>
                  <LinearProgress variant="determinate" value={c.progress} sx={{ width: 64, mt: 0.5 }} color="primary" />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">{t('exploreCourses')}</Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => router.push('/courses')}>{t('seeAll')} →</Typography>
        </Box>
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {COURSES.slice(4, 7).map(c => (
            <Grid item xs={12} sm={4} key={c.id}>
              <Card onClick={() => router.push(`/courses/${c.id}`)} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}>
                <Box sx={{ height: 80, bgcolor: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{c.emoji}</Box>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontSize: '0.6rem' }}>{c.category}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.5 }}>{c.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <StarRateRoundedIcon sx={{ fontSize: 12, color: '#c8a96e' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#c8a96e' }}>{c.rating}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>{c.lessons} lessons</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => router.push('/dashboard')}>
            {t('goToDashboard')}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => router.push('/courses')}>
            {t('exploreCourses')}
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  )
}
