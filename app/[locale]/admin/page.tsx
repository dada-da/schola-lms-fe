'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import DashboardLayout from '@/components/layout/DashboardLayout'

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D']
const ENROLLMENT = [320,410,390,520,610,720,680,810,740,900,870,1040]
const MAX_E = Math.max(...ENROLLMENT)
const REVENUE = [
  { plan: 'Pro plan', amount: '$28.4k', pct: 60, color: '#2d8a7a' },
  { plan: 'Team plan', amount: '$15.1k', pct: 32, color: '#3a6ea8' },
  { plan: 'Add-ons', amount: '$3.7k', pct: 8, color: '#c8a96e' },
]
const USERS = [
  { i: 'NP', name: 'Nguyen Phuong', email: 'n.phuong@email.com', plan: 'Pro', planC: '#e1f2ef', planT: '#1f6257', enrolled: 3, joined: 'Apr 3', status: 'Active', sc: '#e1f2e8', st: '#1f6235', color: '#2d8a7a' },
  { i: 'HV', name: 'Hoang Van', email: 'hv.minh@email.com', plan: 'Team', planC: '#e8f0fa', planT: '#1d4f7a', enrolled: 7, joined: 'Apr 2', status: 'Active', sc: '#e1f2e8', st: '#1f6235', color: '#3a6ea8' },
  { i: 'TL', name: 'Tran Linh', email: 'tlinh@corp.vn', plan: 'Team', planC: '#e8f0fa', planT: '#1d4f7a', enrolled: 12, joined: 'Apr 1', status: 'Invited', sc: '#e8d5a8', st: '#6b4a0e', color: '#c4596a' },
  { i: 'BK', name: 'Bui Khanh', email: 'bkhanh@email.com', plan: 'Starter', planC: '#f0ede6', planT: '#4a4a6a', enrolled: 1, joined: 'Mar 31', status: 'Active', sc: '#e1f2e8', st: '#1f6235', color: '#888' },
  { i: 'LT', name: 'Le Thanh', email: 'lethanh@email.com', plan: 'Pro', planC: '#e1f2ef', planT: '#1f6257', enrolled: 5, joined: 'Mar 30', status: 'Active', sc: '#e1f2e8', st: '#1f6235', color: '#c8a96e' },
]
const TOP_COURSES = [
  { emoji: '🎨', title: 'Advanced UX Research Methods', bg: '#e1f2ef', enrolled: 3420, rating: 4.9, revenue: '$8.2k' },
  { emoji: '💻', title: 'Full-Stack React & Node.js', bg: '#e8f0fa', enrolled: 5810, rating: 4.8, revenue: '$13.9k' },
  { emoji: '📈', title: 'Growth Marketing Masterclass', bg: '#faeaec', enrolled: 2190, rating: 4.7, revenue: '$5.2k' },
  { emoji: '🧠', title: 'Data Analysis with Python', bg: '#e8d5a8', enrolled: 1640, rating: 4.6, revenue: '$3.9k' },
]
const LOG = [
  { type: 'user', msg: 'Nguyen Phuong enrolled in UX Research', time: '2 min ago' },
  { type: 'course', msg: 'New course published: CSS Mastery', time: '18 min ago' },
  { type: 'payment', msg: 'Team plan payment received · $790', time: '43 min ago' },
  { type: 'user', msg: 'Bui Khanh completed certification', time: '1h ago' },
  { type: 'system', msg: 'Weekly digest emails sent · 4,821', time: '3h ago' },
]
const LOG_COLORS: Record<string, string> = { user: '#2d8a7a', course: '#3a6ea8', payment: '#c8a96e', system: '#888' }

export default function AdminPage() {
  const [period, setPeriod] = useState('last30')
  const t = useTranslations('admin')
  const tc = useTranslations('common')

  const KPIS = [
    { label: t('totalLearners'), value: '12,481', delta: '↑ 8.3% this month', up: true },
    { label: t('monthlyRevenue'), value: '$47.2k', delta: '↑ 12.1% vs last month', up: true },
    { label: t('avgCompletionRate'), value: '73%', delta: '↓ 2pts vs last quarter', up: false },
    { label: t('newCoursesLive'), value: '14', delta: '↑ 3 this month', up: true },
  ]

  const FUNNEL = [
    { stage: t('funnel.signedUp'), pct: 100, color: '#2d8a7a' },
    { stage: t('funnel.enrolled'), pct: 78, color: '#2d8a7a' },
    { stage: t('funnel.module2'), pct: 61, color: '#3a6ea8' },
    { stage: t('funnel.halfway'), pct: 44, color: '#3a6ea8' },
    { stage: t('funnel.completed'), pct: 29, color: '#c4596a' },
    { stage: t('funnel.certified'), pct: 21, color: '#c4596a' },
  ]

  const HEALTH = [
    { icon: '✓', label: t('health.apiUptime'), value: '99.98% (30d)', ok: true, tag: t('health.healthy') },
    { icon: '✓', label: t('health.videoCdn'), value: 'Avg 14ms latency', ok: true, tag: t('health.healthy') },
    { icon: '!', label: t('health.storageUsage'), value: '84% of 5TB', ok: false, tag: t('health.warning') },
    { icon: '✓', label: t('health.paymentGateway'), value: 'Stripe connected', ok: true, tag: t('health.healthy') },
  ]

  const PERIODS = [
    { value: 'last30', label: t('last30days') },
    { value: 'last90', label: t('last90days') },
    { value: 'thisYear', label: t('thisYear') },
  ]

  return (
    <DashboardLayout>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1, position: 'sticky', top: 0, zIndex: 40 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>{t('title')}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('subtitle')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={period} onChange={e => setPeriod(e.target.value)} sx={{ borderRadius: 100 }}>
              {PERIODS.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" size="small">↓ {tc('export')}</Button>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* KPIs */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {KPIS.map(m => (
            <Grid item xs={6} md={3} key={m.label}>
              <Card><CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>{m.label}</Typography>
                <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '2rem', lineHeight: 1.1 }}>{m.value}</Typography>
                <Typography variant="caption" sx={{ color: m.up ? 'success.main' : 'error.main', fontWeight: 500 }}>{m.delta}</Typography>
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12} md={7}>
            <Card><CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">{t('monthlyEnrollments')}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>2025</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 130 }}>
                {ENROLLMENT.map((v, i) => (
                  <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, height: '100%' }}>
                    <Box sx={{ width: '100%', borderRadius: '3px 3px 0 0', bgcolor: 'primary.light', height: `${Math.round((v / MAX_E) * 100)}%`, mt: 'auto', cursor: 'pointer', transition: 'background 0.15s', '&:hover': { bgcolor: 'primary.main' } }} />
                    <Typography variant="caption" sx={{ fontSize: '0.58rem', color: 'text.disabled' }}>{MONTHS[i]}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>{t('revenueByPlan')}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <svg viewBox="0 0 120 120" width="130" height="130">
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#f0ede6" strokeWidth="18"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#2d8a7a" strokeWidth="18" strokeDasharray="169.6 282.6" strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#3a6ea8" strokeWidth="18" strokeDasharray="90.4 282.6" strokeDashoffset="-169.6" strokeLinecap="round" transform="rotate(-90 60 60)"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#c8a96e" strokeWidth="18" strokeDasharray="22.6 282.6" strokeDashoffset="-260" strokeLinecap="round" transform="rotate(-90 60 60)"/>
                    <text x="60" y="55" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1a1a2e" fontFamily="DM Serif Display,serif">$47.2k</text>
                    <text x="60" y="67" textAnchor="middle" fontSize="6" fill="#8888a8" fontFamily="DM Sans,sans-serif">{t('thisMonth')}</text>
                  </svg>
                </Box>
                <Box sx={{ flex: 1 }}>
                  {REVENUE.map((r, i) => (
                    <Box key={r.plan} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.625, borderBottom: i < REVENUE.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: r.color, flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', lineHeight: 1.2 }}>{r.plan}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.amount}</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{r.pct}%</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent></Card>
          </Grid>
        </Grid>

        {/* Users + Courses */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12} md={7}>
            <Card><CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2">{t('recentSignups')}</Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }}>{tc('viewAllUsers')}</Typography>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('tableUser')}</TableCell>
                    <TableCell>{t('tablePlan')}</TableCell>
                    <TableCell>{t('tableEnrolled')}</TableCell>
                    <TableCell>{t('tableJoined')}</TableCell>
                    <TableCell>{t('tableStatus')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {USERS.map(u => (
                    <TableRow key={u.email} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: u.color, fontSize: '0.62rem', fontWeight: 600 }}>{u.i}</Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem', lineHeight: 1.2 }}>{u.name}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={u.plan} size="small" sx={{ bgcolor: u.planC, color: u.planT, height: 18, fontSize: '0.6rem' }} /></TableCell>
                      <TableCell>{u.enrolled}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{u.joined}</TableCell>
                      <TableCell><Chip label={u.status} size="small" sx={{ bgcolor: u.sc, color: u.st, height: 18, fontSize: '0.6rem' }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </Box>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('topCourses')}</Typography>
              {TOP_COURSES.map((c, i) => (
                <Box key={c.title} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 0.875, borderBottom: i < TOP_COURSES.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{c.emoji}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.enrolled.toLocaleString()} {tc('enrolled')}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ color: '#c8a96e', fontWeight: 600, display: 'block' }}>★ {c.rating}</Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>{c.revenue}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
        </Grid>

        {/* Bottom row */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('completionFunnel')}</Typography>
              {FUNNEL.map(f => (
                <Box key={f.stage} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.875 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 70, flexShrink: 0 }}>{f.stage}</Typography>
                  <LinearProgress variant="determinate" value={f.pct} sx={{ flex: 1, '& .MuiLinearProgress-bar': { bgcolor: f.color } }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, width: 32, textAlign: 'right', flexShrink: 0 }}>{f.pct}%</Typography>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('platformHealth')}</Typography>
              {HEALTH.map((h, i) => (
                <Box key={h.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75, borderBottom: i < HEALTH.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: h.ok ? '#e1f2e8' : '#e8d5a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: h.ok ? '#1f6235' : '#6b4a0e', flexShrink: 0 }}>{h.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem', lineHeight: 1.2 }}>{h.label}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{h.value}</Typography>
                  </Box>
                  <Chip label={h.tag} size="small" sx={{ bgcolor: h.ok ? '#e1f2e8' : '#e8d5a8', color: h.ok ? '#1f6235' : '#6b4a0e', height: 18, fontSize: '0.6rem' }} />
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('activityLog')}</Typography>
              {LOG.map((a, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, py: 0.75, borderBottom: i < LOG.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: LOG_COLORS[a.type], flexShrink: 0, mt: 0.75 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem', lineHeight: 1.3 }}>{a.msg}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.time}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
