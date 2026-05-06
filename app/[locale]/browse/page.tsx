'use client'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GuestNav from '@/components/home/GuestNav'
import Logo from '@/components/ui/Logo'
import { COURSES, CATEGORIES, LEVELS } from '@/lib/data'
import type { Course } from '@/lib/data'

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  Design: { bg: '#e1f2ef', color: '#1f6257' },
  Engineering: { bg: '#e8f0fa', color: '#1d4f7a' },
  Marketing: { bg: '#faeaec', color: '#8a3040' },
  'Data Science': { bg: '#e8d5a8', color: '#6b4a0e' },
  Product: { bg: '#e1f2e8', color: '#1f6235' },
}

function GuestCourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  const t = useTranslations('common')
  const catStyle = CAT_COLORS[course.category] ?? { bg: '#f0ede6', color: '#4a4a6a' }
  return (
    <Card
      onClick={onSelect}
      sx={{ cursor: 'pointer', transition: 'transform 0.18s ease, box-shadow 0.18s ease', '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ height: 120, bgcolor: course.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
        {course.emoji}
      </Box>
      <CardContent sx={{ p: 1.75, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Chip label={course.category} size="small" sx={{ alignSelf: 'flex-start', bgcolor: catStyle.bg, color: catStyle.color, height: 20, fontSize: '0.62rem' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.35, mt: 0.25 }}>{course.title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{course.instructor}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5, mt: 0.25 }}>{course.description}</Typography>
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
            ? <Chip label={t('free')} size="small" sx={{ ml: 'auto', bgcolor: '#e1f2ef', color: '#1f6257', height: 18, fontSize: '0.6rem' }} />
            : <Typography variant="caption" sx={{ ml: 'auto', fontWeight: 600, color: 'secondary.main' }}>${course.price}</Typography>
          }
        </Box>
      </CardContent>
    </Card>
  )
}

export default function BrowsePage() {
  const router = useRouter()
  const t = useTranslations('browse')
  const tc = useTranslations('common')
  const tcourses = useTranslations('courses')
  const tlanding = useTranslations('landing')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All levels')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Popular')

  const filtered = useMemo(() => {
    let list = COURSES
    if (category !== 'All') list = list.filter(c => c.category === category)
    if (level !== 'All levels') list = list.filter(c => c.level === level)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }
    if (sort === 'Popular') list = [...list].sort((a, b) => b.students - a.students)
    if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'Newest') list = [...list].sort((a, b) => a.id.localeCompare(b.id))
    if (sort === 'Price: Low') list = [...list].sort((a, b) => a.price - b.price)
    return list
  }, [category, level, search, sort])

  const totalStudents = useMemo(() => COURSES.reduce((acc, c) => acc + c.students, 0), [])
  const hasFilters = search || category !== 'All' || level !== 'All levels'

  return (
    <Box sx={{ bgcolor: '#faf9f6', minHeight: '100vh' }}>
      <GuestNav />

      <Box sx={{ bgcolor: 'secondary.main', color: '#fff', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em' }}>
            {t('eyebrow')}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, mt: 1, mb: 1.5, color: '#fff' }}>
            {t('title')}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 580, mb: 3 }}>
            {t('subtitle')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, px: 2, py: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.5rem', color: '#fff', lineHeight: 1.1 }}>{COURSES.length}</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>{tc('courses')}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, px: 2, py: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.5rem', color: '#fff', lineHeight: 1.1 }}>{(totalStudents / 1000).toFixed(1)}k+</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>{tc('students')}</Typography>
            </Box>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, px: 2, py: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.5rem', color: '#fff', lineHeight: 1.1 }}>{CATEGORIES.length - 1}</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>{t('categoriesLabel')}</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder={tcourses('searchPlaceholder')}
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
            }}
            sx={{ flex: '1 1 240px', maxWidth: 360, bgcolor: 'background.paper' }}
          />
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                onClick={() => setCategory(cat)}
                variant={category === cat ? 'filled' : 'outlined'}
                color={category === cat ? 'primary' : 'default'}
                sx={{ cursor: 'pointer', fontWeight: category === cat ? 600 : 400 }}
              />
            ))}
          </Box>
          <FormControl size="small" sx={{ minWidth: 130, ml: 'auto', bgcolor: 'background.paper' }}>
            <InputLabel>{tcourses('level')}</InputLabel>
            <Select value={level} label={tcourses('level')} onChange={e => setLevel(e.target.value)}>
              {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130, bgcolor: 'background.paper' }}>
            <InputLabel>{tcourses('sortBy')}</InputLabel>
            <Select value={sort} label={tcourses('sortBy')} onChange={e => setSort(e.target.value)}>
              {[
                { value: 'Popular', label: tcourses('sortPopular') },
                { value: 'Rating', label: tcourses('sortRating') },
                { value: 'Newest', label: tcourses('sortNewest') },
                { value: 'Price: Low', label: tcourses('sortPriceLow') },
              ].map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {search
              ? tcourses('coursesFoundFor', { count: filtered.length, search })
              : category !== 'All'
                ? tcourses('coursesFoundIn', { count: filtered.length, category })
                : tcourses('coursesFound', { count: filtered.length })
            }
          </Typography>
          {hasFilters && (
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All levels') }}
            >
              {tc('clearFilters')}
            </Typography>
          )}
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
            <Typography variant="h6">{tcourses('noCoursesFound')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{tcourses('noCoursesHint')}</Typography>
          </Box>
        ) : (
          <Grid container spacing={1.75}>
            {filtered.map(c => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                <GuestCourseCard course={c} onSelect={() => router.push('/login')} />
              </Grid>
            ))}
          </Grid>
        )}

        <Card sx={{ mt: { xs: 5, md: 8 }, bgcolor: 'secondary.main', color: '#fff', textAlign: 'center', p: { xs: 3, md: 5 }, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, bgcolor: 'primary.main', opacity: 0.12, borderRadius: '50%' }} />
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.55)' }}>{t('ctaEyebrow')}</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 1, mb: 1.5, color: '#fff' }}>{t('ctaTitle')}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 520, mx: 'auto' }}>{t('ctaSubtitle')}</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" size="large" endIcon={<ArrowForwardIcon />} onClick={() => router.push('/login')}>
              {t('ctaPrimary')}
            </Button>
            <Button variant="outlined" size="large" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' } }} onClick={() => router.push('/login')}>
              {tc('signIn')}
            </Button>
          </Box>
        </Card>
      </Container>

      <Box sx={{ bgcolor: '#f0ede6', borderTop: '1px solid rgba(26,26,46,0.08)', py: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
          <Logo height={32} />
        </Box>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{tlanding('footer')}</Typography>
      </Box>
    </Box>
  )
}
