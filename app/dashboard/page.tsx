'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { COURSES } from '@/lib/data'

const METRICS = [
  { label: 'Hours this week', value: '14.5', delta: '↑ 18% vs last week', up: true },
  { label: 'Courses in progress', value: '4', delta: '↑ 1 new this month', up: true },
  { label: 'Avg. quiz score', value: '87%', delta: '↑ 5pts improvement', up: true },
  { label: 'Day streak', value: '23 🔥', delta: 'Personal best!', up: true },
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ACTIVITY = [1.5, 2.2, 3.0, 2.5, 3.8, 1.2, 0.3]
const MAX_ACT = Math.max(...ACTIVITY)

const LEADERBOARD = [
  { initials: 'SM', name: 'Sarah M.', pts: 2840, color: '#c8a96e' },
  { initials: 'AM', name: 'Alex Minh (you)', pts: 2610, color: '#2d8a7a' },
  { initials: 'KN', name: 'Kim N.', pts: 2440, color: '#3a6ea8' },
  { initials: 'JT', name: 'James T.', pts: 2190, color: '#c4596a' },
  { initials: 'RL', name: 'Rita L.', pts: 1980, color: '#888' },
]
const UPCOMING = [
  { day: '3', mon: 'Apr', title: 'Design Systems at Scale', sub: 'Live · 3:00 PM · 42 attending' },
  { day: '5', mon: 'Apr', title: 'UX Research Q&A', sub: 'Cohort · 11:00 AM · 18 attending' },
  { day: '8', mon: 'Apr', title: 'React performance deep-dive', sub: 'Live · 2:00 PM · 56 attending' },
]
const ANNOUNCEMENTS = [
  { tag: 'New', color: '#e1f2ef', textColor: '#1f6257', title: '5 new Python courses added', time: '2 hours ago' },
  { tag: 'Event', color: '#faeaec', textColor: '#8a3040', title: 'ScholaConf 2025 — early bird open', time: 'Yesterday' },
  { tag: 'Update', color: '#e8f0fa', textColor: '#1d4f7a', title: 'AI tutor now supports code review', time: '3 days ago' },
]
const CERTS = [
  { name: 'UX Foundations', date: 'Earned Mar 12, 2025' },
  { name: 'JavaScript Essentials', date: 'Earned Feb 4, 2025' },
  { name: 'Agile & Scrum', date: 'Earned Jan 20, 2025' },
]

export default function Dashboard() {
  const router = useRouter()
  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100)

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: '1.35rem' }}>Good morning, Alex 👋</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Friday, April 3 · Week 14 of your journey</Typography>
        </Box>
        <Button variant="outlined" color="secondary" size="small" onClick={() => router.push('/admin')}>Admin view</Button>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Metrics */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {METRICS.map(m => (
            <Grid item xs={6} md={3} key={m.label}>
              <Card><CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>{m.label}</Typography>
                <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '2rem', lineHeight: 1.1 }}>{m.value}</Typography>
                <Typography variant="caption" sx={{ color: m.up ? 'success.main' : 'error.main', fontWeight: 500 }}>{m.delta}</Typography>
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>

        {/* Activity + Leaderboard */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Card><CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">Weekly activity</Typography>
                <Typography variant="caption" sx={{ color: 'primary.main' }}>This week</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 110 }}>
                {ACTIVITY.map((h, i) => (
                  <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, height: '100%' }}>
                    <Box sx={{ width: '100%', borderRadius: '3px 3px 0 0', bgcolor: i === 4 ? 'primary.main' : 'primary.light', height: `${Math.round((h / MAX_ACT) * 100)}%`, mt: 'auto', cursor: 'pointer', transition: 'background 0.2s', '&:hover': { bgcolor: 'primary.main' } }} />
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6rem' }}>{DAYS[i]}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Top learners</Typography>
              {LEADERBOARD.map((p, i) => (
                <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75, borderBottom: i < LEADERBOARD.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? '#c8a96e' : 'text.disabled', width: 16, textAlign: 'center' }}>{i + 1}</Typography>
                  <Avatar sx={{ width: 26, height: 26, bgcolor: p.color, fontSize: '0.62rem', fontWeight: 600 }}>{p.initials}</Avatar>
                  <Typography variant="body2" sx={{ flex: 1, fontSize: '0.82rem', fontWeight: i === 1 ? 600 : 400 }}>{p.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>{p.pts.toLocaleString()}</Typography>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
        </Grid>

        {/* In progress */}
        <Card sx={{ mb: 2 }}><CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2">Continue learning</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer' }} onClick={() => router.push('/courses')}>See all courses</Typography>
          </Box>
          {inProgress.map((c, i) => (
            <Box key={c.id} onClick={() => router.push(`/courses/${c.id}`)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: i < inProgress.length - 1 ? '1px solid' : 'none', borderColor: 'divider', cursor: 'pointer', '&:hover': { bgcolor: 'background.default', mx: -2, px: 2, borderRadius: 1 } }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{c.emoji}</Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Module {c.module} of {c.totalModules} · {c.lastStudied}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{c.progress}%</Typography>
                <LinearProgress variant="determinate" value={c.progress} sx={{ width: 70, mt: 0.5 }} color="primary" />
              </Box>
            </Box>
          ))}
        </CardContent></Card>

        {/* Bottom row */}
        <Grid container spacing={1.5}>
          {/* Upcoming */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Upcoming sessions</Typography>
              {UPCOMING.map((s, i) => (
                <Box key={s.title} sx={{ display: 'flex', gap: 1.25, py: 0.875, borderBottom: i < UPCOMING.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ bgcolor: 'primary.light', color: 'primary.dark', borderRadius: 1.5, px: 0.875, py: 0.5, textAlign: 'center', minWidth: 40, flexShrink: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>{s.day}</Typography>
                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.mon}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.sub}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>

          {/* Announcements */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Announcements</Typography>
              {ANNOUNCEMENTS.map((a, i) => (
                <Box key={a.title} sx={{ py: 0.75, borderBottom: i < ANNOUNCEMENTS.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Chip label={a.tag} size="small" sx={{ bgcolor: a.color, color: a.textColor, height: 18, fontSize: '0.6rem', mb: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{a.title}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.time}</Typography>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>

          {/* Certs */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>My certificates</Typography>
              {CERTS.map((c, i) => (
                <Box key={c.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.875, borderBottom: i < CERTS.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#e8d5a8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🏅</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.82rem' }}>{c.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.date}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, cursor: 'pointer' }}>Download</Typography>
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
