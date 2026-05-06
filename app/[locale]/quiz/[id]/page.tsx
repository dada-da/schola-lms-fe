'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { COURSES } from '@/lib/data'

const QUESTIONS = [
  { type: 'mcq', q: 'Which best describes a "semi-structured" interview?', options: ['A rigid script with no deviation', 'A flexible guide with pre-planned questions that allows follow-ups', 'A fully improvised conversation', 'A written questionnaire sent to participants'], correct: 1 },
  { type: 'truefalse', q: 'Leading questions are acceptable in UX research because they help participants understand what you\'re looking for.', correct: false },
  { type: 'mcq', q: 'What is the primary purpose of a screener survey?', options: ['Test participants\' knowledge', 'Ensure you recruit participants matching your target profile', 'Measure task completion rates', 'Gather quantitative usability data'], correct: 1 },
  { type: 'mcq', q: 'The "5-second rule" in UX research refers to:', options: ['How long to wait before asking follow-up questions', 'The optimal test duration', 'Showing designs briefly to test first impressions', 'Maximum time to complete a task'], correct: 2 },
  { type: 'truefalse', q: 'Affinity mapping groups related observations into themes to synthesize qualitative data.', correct: true },
  { type: 'short', q: 'In 2–3 sentences, explain the difference between "generative" and "evaluative" research.', correct: null },
]

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const t = useTranslations('quiz')
  const tc = useTranslations('common')
  const course = (COURSES.find(c => c.id === params.id) ?? COURSES[0])!

  const [phase, setPhase] = useState<'intro' | 'quiz' | 'results'>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [startTime, setStartTime] = useState(0)

  useEffect(() => {
    if (phase !== 'quiz') return
    const timer = setInterval(() => setTimeLeft(s => { if (s <= 1) { clearInterval(timer); setPhase('results'); return 0 } return s - 1 }), 1000)
    return () => clearInterval(timer)
  }, [phase])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const answeredCount = Object.keys(answers).length
  const score = Math.round(QUESTIONS.filter((q, i) => q.correct !== null && answers[i] === q.correct).length / QUESTIONS.filter(q => q.correct !== null).length * 100)
  const passed = score >= 70
  const q = QUESTIONS[currentQ]!

  const start = () => { setPhase('quiz'); setStartTime(Date.now()) }
  const reset = () => { setAnswers({}); setCurrentQ(0); setTimeLeft(15 * 60); setPhase('intro') }

  if (phase === 'intro') {return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
        <Card sx={{ maxWidth: 500, width: '100%' }}><CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '3rem', mb: 1.5 }}>📝</Typography>
          <Chip label={t('moduleQuiz')} size="small" color="primary" sx={{ mb: 2 }} />
          <Typography variant="h3" sx={{ fontSize: '1.8rem', mb: 1.5 }}>{t('title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
            {t('description')}
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {[{ n: QUESTIONS.length, l: tc('questions') }, { n: 15, l: tc('minutes') }, { n: '70%', l: tc('passMark') }].map(s => (
              <Grid item xs={4} key={s.l}>
                <Box sx={{ bgcolor: 'background.default', borderRadius: 2, py: 1.5 }}>
                  <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.6rem' }}>{s.n}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.l}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button fullWidth variant="contained" color="primary" size="large" onClick={start}>{t('beginQuiz')}</Button>
          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} onClick={() => router.push(`/courses/${course.id}`)}>
            ← {tc('backToCourse')}
          </Typography>
        </CardContent></Card>
      </Box>
    </DashboardLayout>
  )}

  if (phase === 'results') {return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
        <Card sx={{ maxWidth: 500, width: '100%' }}><CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '3rem', mb: 1.5 }}>{passed ? '🎉' : '😔'}</Typography>
          <Chip label={passed ? t('passed') : t('notQuite')} size="small" color={passed ? 'success' : 'error'} sx={{ mb: 2 }} />
          <Typography variant="h3" sx={{ fontSize: '1.8rem', mb: 1 }}>{t('yourScore', { score })}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.75 }}>
            {passed ? t('passedMessage') : t('failedMessage')}
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            {[
              { n: QUESTIONS.filter((q, i) => q.correct !== null && answers[i] === q.correct).length, l: tc('correct'), color: '#e1f2ef', textColor: '#1f6257' },
              { n: QUESTIONS.filter(q => q.correct !== null).length - QUESTIONS.filter((q, i) => q.correct !== null && answers[i] === q.correct).length, l: tc('incorrect'), color: '#faeaec', textColor: '#8a3040' },
              { n: fmt(15 * 60 - timeLeft), l: tc('timeTaken'), color: '#e8f0fa', textColor: '#1d4f7a' },
            ].map(s => (
              <Grid item xs={4} key={s.l}>
                <Box sx={{ bgcolor: s.color, borderRadius: 2, py: 1.5 }}>
                  <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.6rem', color: s.textColor }}>{s.n}</Typography>
                  <Typography variant="caption" sx={{ color: s.textColor, opacity: 0.7 }}>{s.l}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="outlined" color="secondary" onClick={() => router.push(`/courses/${course.id}`)}>{tc('backToCourse')}</Button>
            <Button variant="contained" color="primary" onClick={reset}>{t('retakeQuiz')}</Button>
          </Box>
        </CardContent></Card>
      </Box>
    </DashboardLayout>
  )}

  return (
    <DashboardLayout>
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, position: 'sticky', top: 0, zIndex: 40 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0, display: { xs: 'none', sm: 'block' } }}>{t('title')}</Typography>
        <LinearProgress variant="determinate" value={((currentQ + 1) / QUESTIONS.length) * 100} sx={{ flex: 1 }} color="primary" />
        <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>{currentQ + 1} / {QUESTIONS.length}</Typography>
        <Chip
          label={`⏱ ${fmt(timeLeft)}`}
          size="small"
          sx={{ bgcolor: timeLeft < 60 ? '#faeaec' : 'background.default', color: timeLeft < 60 ? '#8a3040' : 'text.primary', fontWeight: 600, flexShrink: 0 }}
        />
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: 'auto' }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Card><CardContent sx={{ p: 3 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 1 }}>{t('question', { num: currentQ + 1 })}</Typography>
              <Typography variant="h5" sx={{ fontSize: '1.25rem', lineHeight: 1.4, mb: 3 }}>{q.q}</Typography>

              {q.type === 'mcq' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  {q.options!.map((opt, i) => (
                    <Box
                      key={i}
                      onClick={() => setAnswers(a => ({ ...a, [currentQ]: i }))}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2,
                        border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                        borderColor: answers[currentQ] === i ? 'primary.main' : 'divider',
                        bgcolor: answers[currentQ] === i ? 'primary.light' : 'background.paper',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
                      }}
                    >
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: answers[currentQ] === i ? 'primary.main' : 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: answers[currentQ] === i ? '#fff' : 'text.secondary' }}>{String.fromCharCode(65 + i)}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: answers[currentQ] === i ? 'primary.dark' : 'text.primary', fontWeight: answers[currentQ] === i ? 500 : 400 }}>{opt}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {q.type === 'truefalse' && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                  {[true, false].map(val => (
                    <Box
                      key={String(val)}
                      onClick={() => setAnswers(a => ({ ...a, [currentQ]: val }))}
                      sx={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2,
                        border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
                        borderColor: answers[currentQ] === val ? 'primary.main' : 'divider',
                        bgcolor: answers[currentQ] === val ? 'primary.light' : 'background.paper',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
                      }}
                    >
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: answers[currentQ] === val ? 'primary.main' : 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: answers[currentQ] === val ? '#fff' : 'text.secondary' }}>{val ? 'T' : 'F'}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{val ? t('true') : t('false')}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {q.type === 'short' && (
                <TextField multiline rows={4} fullWidth placeholder={t('typePlaceholder')} value={answers[currentQ] ?? ''} onChange={e => setAnswers(a => ({ ...a, [currentQ]: e.target.value }))} sx={{ mb: 3 }} />
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button variant="outlined" color="secondary" size="small" disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)}>← {tc('prev')}</Button>
                <Box sx={{ display: 'flex', gap: 0.75, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {QUESTIONS.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setCurrentQ(i)}
                      sx={{ width: 8, height: 8, borderRadius: '50%', cursor: 'pointer', bgcolor: i === currentQ ? 'primary.main' : answers[i] !== undefined ? 'primary.light' : 'divider', border: i === currentQ ? 'none' : answers[i] !== undefined ? '1.5px solid' : '1.5px solid', borderColor: i === currentQ ? 'none' : answers[i] !== undefined ? 'primary.main' : 'divider', transition: 'all 0.15s' }}
                    />
                  ))}
                </Box>
                {currentQ < QUESTIONS.length - 1
                  ? <Button variant="contained" color="primary" size="small" onClick={() => setCurrentQ(q => q + 1)}>{tc('next')} →</Button>
                  : <Button variant="contained" color="primary" size="small" onClick={() => setPhase('results')}>{tc('submit')}</Button>
                }
              </Box>
            </CardContent></Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 1.5 }}><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('questionsPanel')}</Typography>
              <Grid container spacing={0.75}>
                {QUESTIONS.map((_, i) => (
                  <Grid item xs={2.4} key={i}>
                    <Box
                      onClick={() => setCurrentQ(i)}
                      sx={{ aspectRatio: '1', borderRadius: 1.5, border: '1.5px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.15s',
                        borderColor: i === currentQ ? 'primary.main' : answers[i] !== undefined ? 'primary.main' : 'divider',
                        bgcolor: i === currentQ ? 'primary.main' : answers[i] !== undefined ? 'primary.light' : 'background.paper',
                        color: i === currentQ ? '#fff' : answers[i] !== undefined ? 'primary.dark' : 'text.secondary',
                      }}
                    >{i + 1}</Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>{tc('progress')}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.75 }}>{t('answeredOf', { answered: answeredCount, total: QUESTIONS.length })}</Typography>
              <LinearProgress variant="determinate" value={(answeredCount / QUESTIONS.length) * 100} sx={{ mb: 2 }} color="primary" />
              <Button fullWidth variant="outlined" color="secondary" size="small" onClick={() => setPhase('results')}>{t('submitEarly')}</Button>
            </CardContent></Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
