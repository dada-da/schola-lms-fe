'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import Logo from '@/components/ui/Logo'
import { COURSES } from '@/lib/data'

const FEATURE_KEYS = [
  { key: 'adaptiveLearning', icon: '🎯', bg: '#e1f2ef' },
  { key: 'liveAsync', icon: '🎥', bg: '#faeaec' },
  { key: 'progressAnalytics', icon: '📊', bg: '#e8f0fa' },
  { key: 'verifiedCerts', icon: '🏆', bg: '#e8d5a8' },
  { key: 'communityCohorts', icon: '👥', bg: '#e1f2ef' },
  { key: 'aiTutor', icon: '🤖', bg: '#faeaec' },
] as const

const STAT_KEYS = [
  { num: '12,400+', key: 'activeLearners' },
  { num: '340+', key: 'expertCourses' },
  { num: '94%', key: 'completionRate' },
  { num: '8,200+', key: 'certificatesIssued' },
] as const

const PLANS = [
  { nameKey: 'starter', featured: false },
  { nameKey: 'pro', featured: true },
  { nameKey: 'team', featured: false },
] as const

export default function GuestView() {
  const router = useRouter()
  const t = useTranslations('landing')
  const tc = useTranslations('common')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ bgcolor: '#faf9f6' }}>
      <Box component="nav" sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: '#faf9f6', borderBottom: '1px solid rgba(26,26,46,0.08)', px: { xs: 2, md: 4 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo height={36} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
          {[
            { label: tc('features'), href: '#features' },
            { label: tc('courses'), href: '#courses' },
            { label: tc('pricing'), href: '#pricing' },
          ].map(l => (
            <Typography key={l.href} component="a" href={l.href} sx={{ fontSize: '0.875rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>{l.label}</Typography>
          ))}
          <LanguageSwitcher />
          <Button variant="outlined" size="small" color="secondary" onClick={() => router.push('/login')}>{tc('signIn')}</Button>
          <Button variant="contained" size="small" color="primary" onClick={() => router.push('/login')}>{tc('startFree')}</Button>
        </Box>
        <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 260 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
            <Logo height={28} />
            <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider />
          <List>
            {[
              { label: tc('features'), href: '#features' },
              { label: tc('courses'), href: '#courses' },
              { label: tc('pricing'), href: '#pricing' },
            ].map(l => (
              <ListItemButton key={l.href} component="a" href={l.href} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <LanguageSwitcher />
            <Button fullWidth variant="outlined" color="secondary" onClick={() => { router.push('/login'); setMobileOpen(false) }}>{tc('signIn')}</Button>
            <Button fullWidth variant="contained" color="primary" onClick={() => { router.push('/login'); setMobileOpen(false) }}>{tc('startFree')}</Button>
          </Box>
        </Drawer>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 10 }, pb: { xs: 5, md: 8 }, px: { xs: 2, md: 3 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip label={t('aiTutoringChip')} size="small" sx={{ bgcolor: '#e1f2ef', color: '#1f6257', mb: 2, fontWeight: 600 }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '3.5rem' }, lineHeight: 1.08, mb: 2 }}>
              <span dangerouslySetInnerHTML={{ __html: t.raw('heroTitle') }} />
            </Typography>
            <Typography sx={{ fontSize: '1.05rem', color: 'text.secondary', lineHeight: 1.75, mb: 3.5, maxWidth: 440 }}>
              {t('heroDesc')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" color="primary" endIcon={<ArrowForwardIcon />} onClick={() => router.push('/login')}>
                {t('startLearningFree')}
              </Button>
              <Button variant="outlined" size="large" color="secondary" onClick={() => router.push('/login')}>
                {t('browseCourses')}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: 'secondary.main', borderRadius: 4, p: 2.5, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, bgcolor: 'primary.main', opacity: 0.12, borderRadius: '50%' }} />
              {[
                { label: t('inProgress'), title: t('courseUXResearch'), progress: 72, sub: t('moduleProgress', { current: 8, total: 12 }) },
                { label: t('liveTodayLabel'), title: t('courseDesignSystems'), pill: t('enrolledStarting', { count: 42, time: '2h' }) },
              ].map((c, i) => (
                <Box key={i} sx={{ bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, p: 1.75, mb: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>{c.label}</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500, mb: c.progress ? 0.75 : 0 }}>{c.title}</Typography>
                  {c.progress && <><LinearProgress variant="determinate" value={c.progress} sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} /><Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>{c.sub}</Typography></>}
                  {c.pill && <Chip label={c.pill} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', height: 20, fontSize: '0.65rem' }} />}
                </Box>
              ))}
              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                {[{ n: '94%', l: t('completion') }, { n: '12k', l: t('learners') }, { n: '340+', l: tc('courses') }].map(s => (
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

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 1.5 }}>{t('trustedBy')}</Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {['Accenture', 'Shopify', 'Notion', 'Figma', 'Stripe', 'Vercel'].map(c => (
            <Typography key={c} sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1rem', color: 'text.disabled', opacity: 0.55 }}>{c}</Typography>
          ))}
        </Box>
      </Container>

      <Box id="features" sx={{ bgcolor: '#f0ede6', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 0.75 }}>{t('whySchola')}</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: { xs: 3, md: 5 } }}>{t('everythingModernLearner')}</Typography>
          <Grid container spacing={2}>
            {FEATURE_KEYS.map(f => (
              <Grid item xs={12} sm={6} md={4} key={f.key}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 } }}>
                  <CardContent>
                    <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', mb: 1.5 }}>{f.icon}</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{t(`features.${f.key}`)}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>{t(`features.${f.key}Desc`)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="courses" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 0.75 }}>{t('featuredCourses')}</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: { xs: 2.5, md: 4 } }}>{t('learnWhatMatters')}</Typography>
          <Grid container spacing={2}>
            {COURSES.slice(0, 3).map(c => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card onClick={() => router.push('/login')} sx={{ cursor: 'pointer', height: '100%', transition: 'transform 0.18s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 } }}>
                  <Box sx={{ height: 120, bgcolor: c.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{c.emoji}</Box>
                  <CardContent>
                    <Typography variant="overline" sx={{ color: 'primary.main' }}>{c.category}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.25, mb: 0.5 }}>{c.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.lessons} {tc('lessons')} · {c.hours}h</Typography>
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
            <Button variant="outlined" color="secondary" size="large" endIcon={<ArrowForwardIcon />} onClick={() => router.push('/login')}>
              {t('browseAllCourses')}
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'secondary.main', py: 7 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {STAT_KEYS.map(s => (
              <Grid item xs={6} md={3} key={s.key} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: { xs: '1.8rem', md: '2.6rem' }, color: '#fff' }}>{s.num}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', mt: 0.25 }}>{t(`stats.${s.key}`)}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="pricing" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 0.75, textAlign: 'center' }}>{t('pricingSection')}</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: { xs: 3, md: 5 }, textAlign: 'center' }}>{t('simplePlans')}</Typography>
          <Grid container spacing={2} alignItems="stretch">
            {PLANS.map(p => {
              const features: string[] = t.raw(`plans.${p.nameKey}Features`)
              return (
                <Grid item xs={12} md={4} key={p.nameKey}>
                  <Card sx={{ height: '100%', bgcolor: p.featured ? 'secondary.main' : 'background.paper', border: p.featured ? 'none' : undefined }}>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="overline" sx={{ color: p.featured ? 'rgba(255,255,255,0.45)' : 'text.disabled', mb: 1.5 }}>{t(`plans.${p.nameKey}`)}</Typography>
                      <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '2.4rem', color: p.featured ? '#fff' : 'text.primary' }}>{t(`plans.${p.nameKey}Price`)}</Typography>
                      <Typography variant="caption" sx={{ color: p.featured ? 'rgba(255,255,255,0.35)' : 'text.secondary', mb: 2.5 }}>{t(`plans.${p.nameKey}Period`)}</Typography>
                      <Box sx={{ flex: 1 }}>
                        {features.map(f => (
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
                        onClick={() => router.push('/login')}
                      >{t(`plans.${p.nameKey}Cta`)}</Button>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#f0ede6', borderTop: '1px solid rgba(26,26,46,0.08)', py: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
          <Logo height={32} />
        </Box>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{t('footer')}</Typography>
      </Box>
    </Box>
  )
}
