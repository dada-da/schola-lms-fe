'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DashboardLayout from '@/components/layout/DashboardLayout'
import RoleHeader from '@/components/home/RoleHeader'
import type { AuthUser } from '@/contexts/auth-context'

export default function AdminView({ user }: { user: AuthUser }) {
  const router = useRouter()
  const t = useTranslations('home.admin')

  const METRICS = [
    { label: t('totalUsers'), value: '12,400', delta: '+240 this month', up: true },
    { label: t('totalCourses'), value: '340', delta: '+12 this month', up: true },
    { label: t('monthlyRevenue'), value: '$142K', delta: '+18% vs last month', up: true },
    { label: t('platformUptime'), value: '99.9%', delta: t('allHealthy'), up: true },
  ]

  const QUICK_LINKS = [
    { label: t('manageUsers'), icon: <PeopleOutlineIcon />, href: '/admin', bg: '#e8f0fa', color: '#1d4f7a' },
    { label: t('manageCourses'), icon: <MenuBookOutlinedIcon />, href: '/courses', bg: '#e1f2ef', color: '#1f6257' },
    { label: t('viewReports'), icon: <BarChartOutlinedIcon />, href: '/admin', bg: '#ede8f5', color: '#5a3a8a' },
    { label: t('systemHealth'), icon: <HealthAndSafetyOutlinedIcon />, href: '/admin', bg: '#faeaec', color: '#8a3040' },
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
                  <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1.85rem', lineHeight: 1.1 }}>{m.value}</Typography>
                  <Typography variant="caption" sx={{ color: m.up ? 'success.main' : 'error.main', fontWeight: 500 }}>{m.delta}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mb: 2.5 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>{t('quickAccess')}</Typography>
            <Grid container spacing={1.5}>
              {QUICK_LINKS.map(l => (
                <Grid item xs={6} sm={3} key={l.label}>
                  <Box
                    onClick={() => router.push(l.href)}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 2, borderRadius: 2, bgcolor: l.bg, cursor: 'pointer', transition: 'opacity 0.15s', '&:hover': { opacity: 0.8 } }}
                  >
                    <Box sx={{ color: l.color, '& svg': { fontSize: '1.75rem' } }}>{l.icon}</Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: l.color, textAlign: 'center' }}>{l.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="large"
          startIcon={<AdminPanelSettingsOutlinedIcon />}
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/admin')}
          sx={{ py: 1.5, px: 3 }}
        >
          {t('goToAdmin')}
        </Button>
      </Box>
    </DashboardLayout>
  )
}
