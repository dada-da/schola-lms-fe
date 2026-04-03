'use client'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { COURSES } from '@/lib/data'

const FEATURES = [
  { icon: '🎯', title: 'Adaptive learning paths', desc: 'AI-powered recommendations that adjust based on your pace, strengths, and goals.', bg: '#e1f2ef' },
  { icon: '🎥', title: 'Live & async learning', desc: 'Cohort sessions or self-paced — learn however fits your schedule.', bg: '#faeaec' },
  { icon: '📊', title: 'Progress analytics', desc: 'Streaks, quiz scores, and skill growth tracked beautifully over time.', bg: '#e8f0fa' },
  { icon: '🏆', title: 'Verified certificates', desc: 'Share on LinkedIn or download — one click, fully verified credentials.', bg: '#e8d5a8' },
  { icon: '👥', title: 'Community cohorts', desc: 'Peer reviews, group projects and discussion boards, always on.', bg: '#e1f2ef' },
  { icon: '🤖', title: 'AI tutor, 24/7', desc: 'Instant answers, code reviews and essay feedback whenever you need.', bg: '#faeaec' },
]

const STATS = [
  { num: '12,400+', lbl: 'Active learners' },
  { num: '340+', lbl: 'Expert-led courses' },
  { num: '94%', lbl: 'Completion rate' },
  { num: '8,200+', lbl: 'Certificates issued' },
]

const PLANS = [
  { name: 'Starter', price: 'Free', period: 'forever', features: ['5 free courses', 'Community access', 'Progress tracking', 'Basic certificates'], cta: 'Get started free', featured: false },
  { name: 'Pro', price: '$29', period: '/month, billed annually', features: ['Unlimited courses', 'Live cohort sessions', 'AI tutor access', 'Verified certificates', 'Priority support'], cta: 'Start 14-day trial', featured: true },
  { name: 'Team', price: '$79', period: '/seat/month', features: ['Everything in Pro', 'Team analytics', 'Custom learning paths', 'SSO & SCORM', 'Dedicated CSM'], cta: 'Contact sales', featured: false },
]

export default function Home() {
  const router = useRouter()

  return (
    <Box sx={{ bgcolor: '#faf9f6' }}>
      {/* Nav */}
      <Box component="nav" sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: '#faf9f6', borderBottom: '1px solid rgba(26,26,46,0.08)', px: 4, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1.4rem', color: 'secondary.main' }}>
          Schola<Box component="span" sx={{ color: 'primary.main' }}>LMS</Box>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {['Features', 'Courses', 'Pricing'].map(l => (
            <Typography key={l} component="a" href={`#${l.toLowerCase()}`} sx={{ fontSize: '0.875rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>{l}</Typography>
          ))}
          <Button variant="outlined" size="small" color="secondary" onClick={() => router.push('/dashboard')}>Sign in</Button>
          <Button variant="contained" size="small" color="primary" onClick={() => router.push('/dashboard')}>Start free</Button>
        </Box>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip label="Now with AI tutoring" size="small" sx={{ bgcolor: '#e1f2ef', color: '#1f6257', mb: 2, fontWeight: 600 }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '3.5rem' }, lineHeight: 1.08, mb: 2 }}>
              Learn <em style={{ color: '#2d8a7a' }}>deeper,</em><br />grow faster.
            </Typography>
            <Typography sx={{ fontSize: '1.05rem', color: 'text.secondary', lineHeight: 1.75, mb: 3.5, maxWidth: 440 }}>
              ScholaLMS is the modern platform that adapts to how you think — combining structured courses, live mentorship, and intelligent feedback.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" color="primary" endIcon={<ArrowForwardIcon />} onClick={() => router.push('/dashboard')}>
                Start learning free
              </Button>
              <Button variant="outlined" size="large" color="secondary" onClick={() => router.push('/courses')}>
                Browse courses
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'secondary.main', borderRadius: 4, p: 2.5, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, bgcolor: 'primary.main', opacity: 0.12, borderRadius: '50%' }} />
              {[
                { label: 'In progress', title: 'Advanced UX Research Methods', progress: 72, sub: 'Module 8 of 12' },
                { label: 'Live today · 3PM', title: 'Design Systems at Scale', pill: '42 enrolled · Starts in 2h' },
              ].map((c, i) => (
                <Box key={i} sx={{ bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, p: 1.75, mb: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>{c.label}</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500, mb: c.progress ? 0.75 : 0 }}>{c.title}</Typography>
                  {c.progress && <><LinearProgress variant="determinate" value={c.progress} sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} /><Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>{c.sub}</Typography></>}
                  {c.pill && <Chip label={c.pill} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', height: 20, fontSize: '0.65rem' }} />}
                </Box>
              ))}
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                {[{ n: '94%', l: 'Completion' }, { n: '12k', l: 'Learners' }, { n: '340+', l: 'Courses' }].map(s => (
                  <Grid item xs={4} key={s.l}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, p: 1 }}>
                      <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1.4rem', color: '#fff' }}>{s.n}</Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{s.l}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Social proof */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 1.5 }}>Trusted by learners at</Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {['Accenture', 'Shopify', 'Notion', 'Figma', 'Stripe', 'Vercel'].map(c => (
            <Typography key={c} sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1rem', color: 'text.disabled', opacity: 0.55 }}>{c}</Typography>
          ))}
        </Box>
      </Container>

      {/* Features */}
      <Box id="features" sx={{ bgcolor: '#f0ede6', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 0.75 }}>Why ScholaLMS</Typography>
          <Typography variant="h2" sx={{ fontSize: '2.4rem', mb: 5 }}>Everything a modern learner needs</Typography>
          <Grid container spacing={2}>
            {FEATURES.map(f => (
              <Grid item xs={12} sm={6} md={4} key={f.title}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 } }}>
                  <CardContent>
                    <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', mb: 1.5 }}>{f.icon}</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Courses */}
      <Box id="courses" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 0.75 }}>Featured courses</Typography>
          <Typography variant="h2" sx={{ fontSize: '2.4rem', mb: 4 }}>Learn what matters now</Typography>
          <Grid container spacing={2}>
            {COURSES.slice(0, 3).map(c => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card onClick={() => router.push(`/courses/${c.id}`)} sx={{ cursor: 'pointer', height: '100%', transition: 'transform 0.18s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 } }}>
                  <Box sx={{ height: 120, bgcolor: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{c.emoji}</Box>
                  <CardContent>
                    <Typography variant="overline" sx={{ color: 'primary.main' }}>{c.category}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.25, mb: 0.5 }}>{c.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.lessons} lessons · {c.hours}h</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <StarRateRoundedIcon sx={{ fontSize: 13, color: '#c8a96e' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#c8a96e' }}>{c.rating}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="outlined" color="secondary" size="large" endIcon={<ArrowForwardIcon />} onClick={() => router.push('/courses')}>
              Browse all courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ bgcolor: 'secondary.main', py: 7 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {STATS.map(s => (
              <Grid item xs={6} md={3} key={s.lbl} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '2.6rem', color: '#fff' }}>{s.num}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', mt: 0.25 }}>{s.lbl}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing */}
      <Box id="pricing" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 0.75, textAlign: 'center' }}>Pricing</Typography>
          <Typography variant="h2" sx={{ fontSize: '2.4rem', mb: 5, textAlign: 'center' }}>Simple, transparent plans</Typography>
          <Grid container spacing={2} alignItems="stretch">
            {PLANS.map(p => (
              <Grid item xs={12} md={4} key={p.name}>
                <Card sx={{ height: '100%', bgcolor: p.featured ? 'secondary.main' : 'background.paper', border: p.featured ? 'none' : undefined }}>
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Typography variant="overline" sx={{ color: p.featured ? 'rgba(255,255,255,0.45)' : 'text.disabled', mb: 1.5 }}>{p.name}</Typography>
                    <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '2.4rem', color: p.featured ? '#fff' : 'text.primary' }}>{p.price}</Typography>
                    <Typography variant="caption" sx={{ color: p.featured ? 'rgba(255,255,255,0.35)' : 'text.secondary', mb: 2.5 }}>{p.period}</Typography>
                    <Box sx={{ flex: 1 }}>
                      {p.features.map(f => (
                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.625, borderBottom: `1px solid ${p.featured ? 'rgba(255,255,255,0.1)' : 'rgba(26,26,46,0.07)'}` }}>
                          <Typography sx={{ color: p.featured ? '#9fd8d0' : 'primary.main', fontSize: '0.72rem', fontWeight: 700 }}>✓</Typography>
                          <Typography variant="body2" sx={{ color: p.featured ? 'rgba(255,255,255,0.65)' : 'text.secondary' }}>{f}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      fullWidth variant={p.featured ? 'contained' : 'outlined'}
                      color={p.featured ? 'primary' : 'secondary'}
                      sx={{ mt: 3, borderRadius: 100 }}
                      onClick={() => router.push('/dashboard')}
                    >{p.cta}</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#f0ede6', borderTop: '1px solid rgba(26,26,46,0.08)', py: 4, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1.2rem', color: 'secondary.main', mb: 0.5 }}>
          Schola<Box component="span" sx={{ color: 'primary.main' }}>LMS</Box>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>© 2025 ScholaLMS · Built for curious minds everywhere</Typography>
      </Box>
    </Box>
  )
}
