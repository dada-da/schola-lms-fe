'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { COURSES } from '@/lib/data'

type Lesson = { title: string; duration: string; done?: boolean; current?: boolean }
type Module = { title: string; done: boolean; active?: boolean; lessons: Lesson[] }

const MODULES: Module[] = [
  { title: 'Foundations of UX Research', done: true, lessons: [
    { title: 'What is UX research?', duration: '12 min', done: true },
    { title: 'Research methods overview', duration: '18 min', done: true },
    { title: 'Choosing the right method', duration: '22 min', done: true },
  ]},
  { title: 'Planning & Recruiting', done: true, lessons: [
    { title: 'Writing a research plan', duration: '20 min', done: true },
    { title: 'Recruiting participants', duration: '15 min', done: true },
    { title: 'Screener surveys', duration: '10 min', done: true },
  ]},
  { title: 'Interview Techniques', done: false, active: true, lessons: [
    { title: 'User Interview Techniques', duration: '35 min', current: true },
    { title: 'Active listening', duration: '14 min' },
    { title: 'Avoiding bias', duration: '18 min' },
  ]},
  { title: 'Usability Testing', done: false, lessons: [
    { title: 'Moderated vs unmoderated', duration: '20 min' },
    { title: 'Setting up tasks', duration: '12 min' },
    { title: 'Analyzing results', duration: '25 min' },
  ]},
]
const DISCUSSIONS = [
  { initials: 'SM', name: 'Sarah M.', color: '#2d8a7a', time: '2 hours ago', text: 'The section on avoiding bias was really eye-opening. I had no idea I was leading participants without realizing it. The 5-second rule tip is something I\'m implementing immediately.', likes: 12 },
  { initials: 'JT', name: 'James T.', color: '#3a6ea8', time: 'Yesterday', text: 'Kate\'s framework for synthesizing interview data is the clearest I\'ve seen. Would love to see a worked example with a real product though!', likes: 8 },
  { initials: 'RL', name: 'Rita L.', color: '#c4596a', time: '3 days ago', text: 'Question: how do you handle participants who go completely off-script?', likes: 5 },
]
const RESOURCES = [
  { icon: '📄', name: 'Research Plan Template', type: 'PDF', size: '1.2 MB', bg: '#faeaec' },
  { icon: '📊', name: 'Interview Debrief Spreadsheet', type: 'XLSX', size: '540 KB', bg: '#e1f2e8' },
  { icon: '🎨', name: 'Affinity Mapping Figma Kit', type: 'Figma', size: '3.8 MB', bg: '#e8f0fa' },
  { icon: '📋', name: 'Screener Survey Examples', type: 'PDF', size: '890 KB', bg: '#e8d5a8' },
]

export default function CourseDetail() {
  const router = useRouter()
  const params = useParams()
  const t = useTranslations('courseDetail')
  const tc = useTranslations('common')
  const [activeTab, setActiveTab] = useState(0)
  const course = (COURSES.find(c => c.id === params.id) ?? COURSES[0])!

  return (
    <DashboardLayout>
      <Box sx={{ px: 3, py: 1.75, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push('/dashboard')}>{t('dashboard')}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>›</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push('/courses')}>{t('courses')}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>›</Typography>
            <Typography variant="caption">{course.title}</Typography>
          </Box>
          <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>{course.title}</Typography>
        </Box>
        <Button variant="contained" color="primary" size="small" onClick={() => router.push(`/quiz/${course.id}`)}>{t('takeQuiz')}</Button>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            {/* Video player */}
            <Card sx={{ mb: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 280, bgcolor: 'secondary.main', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, position: 'relative', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3a5e 100%)' }}>
                <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, bgcolor: 'primary.main', opacity: 0.1, borderRadius: '50%' }} />
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', '&:hover': { bgcolor: 'primary.main' } }}>
                  <PlayCircleOutlineIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>User Interview Techniques</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>35 min · Module 3</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, bgcolor: '#111827' }}>
                <Button size="small" sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }} variant="outlined">{t('prevLesson')}</Button>
                <Box sx={{ flex: 1, px: 1 }}>
                  <LinearProgress variant="determinate" value={35} sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#fff' } }} />
                </Box>
                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>12:30 / 35:00</Typography>
                <Button size="small" variant="contained" color="primary">{t('nextLesson')}</Button>
              </Box>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              {[t('overview'), t('curriculum'), t('discussion'), t('resources')].map(label => <Tab key={label} label={label} />)}
            </Tabs>

            {/* Overview */}
            {activeTab === 0 && (
              <Card><CardContent>
                <Typography variant="h5" sx={{ mb: 1 }}>{course.title}</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 2 }}>{course.description}</Typography>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                  {course.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                </Box>
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarRateRoundedIcon sx={{ fontSize: 16, color: '#c8a96e' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#c8a96e' }}>{course.rating}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>({course.reviews} {tc('reviews')})</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{course.students.toLocaleString()} {tc('students')}</Typography>
                  <Chip label={course.level} size="small" sx={{ bgcolor: '#e1f2ef', color: '#1f6257' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.default', borderRadius: 2, p: 1.5 }}>
                  <Avatar sx={{ bgcolor: course.instructorColor, fontWeight: 600, fontSize: '0.82rem' }}>{course.instructorInitials}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">{course.instructor}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Principal UX Researcher · Google · Author of &ldquo;Research That Ships&rdquo;</Typography>
                  </Box>
                </Box>
              </CardContent></Card>
            )}

            {/* Curriculum */}
            {activeTab === 1 && (
              <Box>
                {MODULES.map((mod, mi) => (
                  <Accordion key={mi} defaultExpanded={mi < 2} disableGutters sx={{ mb: 0.75, border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, borderRadius: '8px !important', overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: mod.active ? 'primary.light' : 'background.paper' }}>
                      <Typography variant="subtitle2">{t('module', { num: mi + 1 })}: {mod.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto', mr: 2 }}>{mod.lessons.length} {tc('lessons')}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      {mod.lessons.map((l, li) => (
                        <Box key={li} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', bgcolor: l.current ? 'primary.light' : 'transparent', cursor: 'pointer', '&:hover': { bgcolor: 'background.default' } }}>
                          {l.done ? <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} /> : l.current ? <PlayCircleOutlineIcon sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }} />}
                          <Typography variant="body2" sx={{ flex: 1, color: l.current ? 'primary.dark' : l.done ? 'text.secondary' : 'text.primary', fontWeight: l.current ? 500 : 400 }}>{l.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>{l.duration}</Typography>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {/* Discussion */}
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

            {/* Resources */}
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
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 2 }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('yourProgress')}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('overallCompletion')}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{course.progress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={course.progress} sx={{ mb: 2 }} color="primary" />
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {[{ n: course.progress > 0 ? Math.round(course.totalModules * course.progress / 100) : 0, l: t('lessonsDone') }, { n: course.lessons, l: t('total') }, { n: `${Math.round(course.hours * (1 - course.progress / 100) * 10) / 10}h`, l: t('remaining') }].map(s => (
                  <Grid item xs={4} key={s.l}>
                    <Box sx={{ bgcolor: 'background.default', borderRadius: 1.5, p: 1, textAlign: 'center' }}>
                      <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1.25rem' }}>{s.n}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Button fullWidth variant="contained" color="primary" onClick={() => router.push(`/quiz/${course.id}`)}>{t('takeModuleQuiz')}</Button>
            </CardContent></Card>

            <Card><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('courseModules')}</Typography>
              {MODULES.map((mod, mi) => (
                <Box key={mi} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75, borderBottom: mi < MODULES.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, bgcolor: mod.done ? 'primary.main' : mod.active ? 'transparent' : 'divider', border: mod.active ? '2px solid' : 'none', borderColor: mod.active ? 'primary.main' : 'transparent', boxShadow: mod.active ? '0 0 0 3px #e1f2ef' : 'none' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: mod.active ? 600 : 400, color: mod.active ? 'primary.dark' : 'text.primary' }}>{mod.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{mod.lessons.length} {tc('lessons')}</Typography>
                  </Box>
                  {mod.done && <Typography sx={{ fontSize: '0.78rem', color: 'primary.main' }}>✓</Typography>}
                </Box>
              ))}
            </CardContent></Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
