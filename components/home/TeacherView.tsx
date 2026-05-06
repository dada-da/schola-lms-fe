'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import RoleHeader from '@/components/home/RoleHeader'
import type { AuthUser } from '@/contexts/auth-context'
import { COURSES } from '@/lib/data'

const TEACHER_COURSES = COURSES.slice(0, 4).map((c, i) => ({
  ...c,
  studentsCount: [48, 132, 67, 91][i],
}))

export default function TeacherView({ user }: { user: AuthUser }) {
  const router = useRouter()
  const t = useTranslations('home.teacher')
  const tc = useTranslations('common')

  const METRICS = [
    { label: t('myStudents'), value: '156', icon: <PeopleOutlineIcon /> },
    { label: t('publishedCourses'), value: '8', icon: <MenuBookOutlinedIcon /> },
    { label: t('avgCompletion'), value: '78%', icon: <BarChartOutlinedIcon /> },
    { label: t('pendingReviews'), value: '12', icon: <MenuBookOutlinedIcon /> },
  ]

  const QUICK_ACTIONS = [
    { label: t('createCourse'), icon: <AddCircleOutlineIcon />, onClick: () => router.push('/courses/manage'), color: 'primary.main', bg: '#e1f2ef' },
    { label: t('viewStudents'), icon: <PeopleOutlineIcon />, onClick: () => router.push('/dashboard'), color: '#1d4f7a', bg: '#e8f0fa' },
    { label: t('viewAnalytics'), icon: <BarChartOutlinedIcon />, onClick: () => router.push('/dashboard'), color: '#5a3a8a', bg: '#ede8f5' },
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
                  <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '2rem', lineHeight: 1.1 }}>{m.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2">{t('myCourses')}</Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => router.push('/courses/manage')}>{tc('seeAll')} →</Typography>
                </Box>
                {TEACHER_COURSES.map((c, i) => (
                  <Box
                    key={c.id}
                    onClick={() => router.push(`/courses/${c.id}`)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderBottom: i < TEACHER_COURSES.length - 1 ? '1px solid' : 'none', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'background.default', mx: -2, px: 2, borderRadius: 1 } }}
                  >
                    <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{c.emoji}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.studentsCount} {t('studentsEnrolled')} · {c.level}</Typography>
                    </Box>
                    <Chip label={c.category} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>{t('quickActions')}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {QUICK_ACTIONS.map(a => (
                    <Box
                      key={a.label}
                      onClick={a.onClick}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: a.bg, cursor: 'pointer', transition: 'opacity 0.15s', '&:hover': { opacity: 0.8 } }}
                    >
                      <Box sx={{ color: a.color }}>{a.icon}</Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: a.color }}>{a.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
