'use client'
import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CourseCard from '@/components/ui/CourseCard'
import { COURSES, CATEGORIES, LEVELS } from '@/lib/data'

export default function CoursesPage() {
  const [tab, setTab] = useState(0)          // 0=All, 1=My courses
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All levels')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Popular')

  const filtered = useMemo(() => {
    let list = tab === 1 ? COURSES.filter(c => c.progress > 0) : COURSES
    if (category !== 'All') list = list.filter(c => c.category === category)
    if (level !== 'All levels') list = list.filter(c => c.level === level)
    if (search.trim()) list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (sort === 'Popular') list = [...list].sort((a, b) => b.students - a.students)
    if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === 'Newest') list = [...list].sort((a, b) => a.id.localeCompare(b.id))
    if (sort === 'Price: Low') list = [...list].sort((a, b) => a.price - b.price)
    return list
  }, [tab, category, level, search, sort])

  const myInProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const myCompleted = COURSES.filter(c => c.progress === 100)

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 40 }}>
        <Typography variant="h4" sx={{ fontSize: '1.35rem' }}>Courses</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {COURSES.length} courses available · {COURSES.filter(c => c.progress > 0).length} enrolled
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Tabs: All / My Courses */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tab label="All courses" />
          <Tab label={`My courses (${COURSES.filter(c => c.progress > 0).length})`} />
        </Tabs>

        {/* My courses summary (when tab=1) */}
        {tab === 1 && (
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {[
              { label: 'In progress', value: myInProgress.length, color: '#e1f2ef', text: '#1f6257' },
              { label: 'Completed', value: myCompleted.length, color: '#e8d5a8', text: '#6b4a0e' },
              { label: 'Total hours studied', value: '42.5h', color: '#e8f0fa', text: '#1d4f7a' },
              { label: 'Avg. completion', value: `${Math.round(COURSES.filter(c => c.progress > 0).reduce((a, b) => a + b.progress, 0) / COURSES.filter(c => c.progress > 0).length)}%`, color: '#faeaec', text: '#8a3040' },
            ].map(s => (
              <Grid item xs={6} md={3} key={s.label}>
                <Box sx={{ bgcolor: s.color, borderRadius: 2, px: 2, py: 1.5 }}>
                  <Typography sx={{ fontFamily: '"DM Serif Display",serif', fontSize: '1.8rem', color: s.text, lineHeight: 1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: s.text, opacity: 0.7, fontWeight: 600 }}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Filters row */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Search courses or topics…"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
            }}
            sx={{ flex: '1 1 220px', maxWidth: 320 }}
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

          <FormControl size="small" sx={{ minWidth: 130, ml: 'auto' }}>
            <InputLabel>Level</InputLabel>
            <Select value={level} label="Level" onChange={e => setLevel(e.target.value)}>
              {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Sort by</InputLabel>
            <Select value={sort} label="Sort by" onChange={e => setSort(e.target.value)}>
              {['Popular', 'Rating', 'Newest', 'Price: Low'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Results count */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
            {search && ` for "${search}"`}
            {category !== 'All' && ` in ${category}`}
          </Typography>
          {(search || category !== 'All' || level !== 'All levels') && (
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All levels') }}
            >
              Clear filters
            </Typography>
          )}
        </Box>

        {/* In progress section (my courses tab) */}
        {tab === 1 && myInProgress.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, mt: 1 }}>Continue learning</Typography>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {myInProgress.map(c => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                  <CourseCard course={c} showProgress />
                </Grid>
              ))}
            </Grid>
            {myCompleted.length > 0 && (
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, mt: 1 }}>Completed</Typography>
            )}
          </>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
            <Typography variant="h6">No courses found</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Try adjusting your search or filters</Typography>
          </Box>
        ) : (
          <Grid container spacing={1.5}>
            {filtered.map(c => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                <CourseCard course={c} showProgress={tab === 1} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  )
}
