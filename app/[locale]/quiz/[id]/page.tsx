'use client'
import { useEffect, useMemo, useState } from 'react'
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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import DashboardLayout from '@/components/layout/DashboardLayout'
import type {
  QuizAnswer,
  QuizAttempt,
  QuizAttemptResult,
  QuizQuestion,
  QuestionWithAnswers,
} from '@/components/manage-quiz/types'

type Phase = 'intro' | 'quiz' | 'results'

export default function QuizPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const t = useTranslations('quiz')
  const tc = useTranslations('common')

  const lessonId = Number(params?.id)

  const [phase, setPhase] = useState<Phase>('intro')
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([])
  const [pastAttempts, setPastAttempts] = useState<QuizAttempt[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selections, setSelections] = useState<Record<number, Set<number>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<QuizAttemptResult | null>(null)

  useEffect(() => {
    if (!lessonId) {
      setError(t('notFound'))
      setLoading(false)
      return
    }
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [qsRes, attemptsRes] = await Promise.all([
        fetch(`/api/question?lessonId=${lessonId}`),
        fetch(`/api/quiz-attempt?lessonId=${lessonId}`),
      ])

      if (!qsRes.ok) {
        setError(t('loadFailed'))
        return
      }
      const qs = (await qsRes.json()) as QuizQuestion[]
      const sorted = [...qs].sort((a, b) => a.sequence - b.sequence)

      const answersResults = await Promise.all(
        sorted.map((q) => fetch(`/api/answer?questionId=${q.id}`))
      )
      const all: QuestionWithAnswers[] = []
      for (let i = 0; i < sorted.length; i++) {
        const aRes = answersResults[i]
        const q = sorted[i]
        if (!q || !aRes || !aRes.ok) {
          setError(t('loadFailed'))
          return
        }
        const answers = (await aRes.json()) as QuizAnswer[]
        all.push({ question: q, answers })
      }
      setQuestions(all)

      if (attemptsRes.ok) {
        const arr = (await attemptsRes.json()) as QuizAttempt[]
        if (Array.isArray(arr)) setPastAttempts(arr)
      }
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const total = questions.length
  const answeredCount = useMemo(
    () =>
      questions.reduce(
        (n, qa) => n + ((selections[qa.question.id]?.size ?? 0) > 0 ? 1 : 0),
        0
      ),
    [questions, selections]
  )

  const current = questions[currentQ]
  const correctCountForCurrent = current
    ? current.answers.filter((a) => a.correct).length
    : 1
  const isMultiSelect = correctCountForCurrent >= 2

  function toggle(questionId: number, answerId: number, multi: boolean) {
    setSelections((prev) => {
      const cur = new Set(prev[questionId] ?? [])
      if (multi) {
        if (cur.has(answerId)) cur.delete(answerId)
        else cur.add(answerId)
      } else {
        cur.clear()
        cur.add(answerId)
      }
      return { ...prev, [questionId]: cur }
    })
  }

  function start() {
    setSelections({})
    setCurrentQ(0)
    setResult(null)
    setPhase('quiz')
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const body = {
        lessonId,
        answers: questions.map((qa) => ({
          questionId: qa.question.id,
          selectedAnswerIds: Array.from(selections[qa.question.id] ?? []),
        })),
      }
      const res = await fetch('/api/quiz-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        setError(err?.message ?? t('submitFailed'))
        return
      }
      const data: QuizAttemptResult = await res.json()
      setResult(data)
      setPastAttempts((prev) => [
        { id: data.id, studentId: data.studentId, lessonId: data.lessonId, attemptAt: data.attemptAt },
        ...prev,
      ])
      setPhase('results')
    } catch {
      setError(t('submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  if (phase === 'intro') {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
          <Card sx={{ maxWidth: 540, width: '100%' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '3rem', mb: 1.5 }}>📝</Typography>
              <Chip label={t('moduleQuiz')} size="small" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h3" sx={{ fontSize: '1.8rem', mb: 1.5 }}>
                {t('title')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75, mb: 3 }}>
                {t('description')}
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box sx={{ bgcolor: 'background.default', borderRadius: 2, py: 1.5 }}>
                    <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.6rem' }}>{total}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tc('questions')}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {pastAttempts.length > 0 && (
                <Box sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('pastAttempts')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {pastAttempts.slice(0, 5).map((a) => (
                      <Box
                        key={a.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'background.default',
                          borderRadius: 1.5,
                          px: 1.5,
                          py: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {new Date(a.attemptAt).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={start}
                disabled={total === 0}
              >
                {total === 0 ? t('emptyQuiz') : t('beginQuiz')}
              </Button>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1.5,
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
                onClick={() => router.back()}
              >
                ← {tc('backToCourse')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DashboardLayout>
    )
  }

  if (phase === 'results' && result) {
    const allCorrect = result.correctCount === result.totalQuestions
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: { xs: 2, md: 6 } }}>
          <Card sx={{ maxWidth: 500, width: '100%' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '3rem', mb: 1.5 }}>{allCorrect ? '🎉' : '✅'}</Typography>
              <Typography variant="h3" sx={{ fontSize: '1.8rem', mb: 1 }}>
                {t('yourResult', { correct: result.correctCount, total: result.totalQuestions })}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.75 }}>
                {t('resultMessage')}
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#e1f2ef', borderRadius: 2, py: 1.5 }}>
                    <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.6rem', color: '#1f6257' }}>
                      {result.correctCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1f6257', opacity: 0.7 }}>{tc('correct')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: '#faeaec', borderRadius: 2, py: 1.5 }}>
                    <Typography sx={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.6rem', color: '#8a3040' }}>
                      {result.totalQuestions - result.correctCount}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8a3040', opacity: 0.7 }}>{tc('incorrect')}</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="outlined" color="secondary" onClick={() => router.back()}>
                  {tc('backToCourse')}
                </Button>
                <Button variant="contained" color="primary" onClick={start}>
                  {t('retakeQuiz')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.5,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 2 },
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0, display: { xs: 'none', sm: 'block' } }}>
          {t('title')}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={total === 0 ? 0 : ((currentQ + 1) / total) * 100}
          sx={{ flex: 1 }}
          color="primary"
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
          {currentQ + 1} / {total}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: 'auto' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                {current && (
                  <>
                    <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 1 }}>
                      {t('question', { num: currentQ + 1 })}
                      {isMultiSelect && (
                        <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                          ({t('selectAll')})
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="h5" sx={{ fontSize: '1.25rem', lineHeight: 1.4, mb: 3 }}>
                      {current.question.question}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                      {current.answers.map((opt, i) => {
                        const sel = selections[current.question.id]?.has(opt.id) ?? false
                        return (
                          <Box
                            key={opt.id}
                            onClick={() => toggle(current.question.id, opt.id, isMultiSelect)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2,
                              border: '1.5px solid',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              borderColor: sel ? 'primary.main' : 'divider',
                              bgcolor: sel ? 'primary.light' : 'background.paper',
                              '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
                            }}
                          >
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: isMultiSelect ? 1 : '50%',
                                bgcolor: sel ? 'primary.main' : 'background.default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: sel ? '#fff' : 'text.secondary',
                                }}
                              >
                                {String.fromCharCode(65 + i)}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: sel ? 'primary.dark' : 'text.primary',
                                fontWeight: sel ? 500 : 400,
                              }}
                            >
                              {opt.answer}
                            </Typography>
                          </Box>
                        )
                      })}
                    </Box>
                  </>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ((q) => q - 1)}
                  >
                    ← {tc('prev')}
                  </Button>
                  <Box sx={{ display: 'flex', gap: 0.75, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {questions.map((qa, i) => {
                      const answered = (selections[qa.question.id]?.size ?? 0) > 0
                      return (
                        <Box
                          key={qa.question.id}
                          onClick={() => setCurrentQ(i)}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            bgcolor:
                              i === currentQ
                                ? 'primary.main'
                                : answered
                                  ? 'primary.light'
                                  : 'divider',
                            border:
                              i === currentQ
                                ? 'none'
                                : answered
                                  ? '1.5px solid'
                                  : '1.5px solid',
                            borderColor:
                              i === currentQ
                                ? 'transparent'
                                : answered
                                  ? 'primary.main'
                                  : 'divider',
                            transition: 'all 0.15s',
                          }}
                        />
                      )
                    })}
                  </Box>
                  {currentQ < total - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setCurrentQ((q) => q + 1)}
                    >
                      {tc('next')} →
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? <CircularProgress size={16} color="inherit" /> : tc('submit')}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 1.5 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{t('questionsPanel')}</Typography>
                <Grid container spacing={0.75}>
                  {questions.map((qa, i) => {
                    const answered = (selections[qa.question.id]?.size ?? 0) > 0
                    return (
                      <Grid item xs={2.4} key={qa.question.id}>
                        <Box
                          onClick={() => setCurrentQ(i)}
                          sx={{
                            aspectRatio: '1',
                            borderRadius: 1.5,
                            border: '1.5px solid',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            transition: 'all 0.15s',
                            borderColor:
                              i === currentQ
                                ? 'primary.main'
                                : answered
                                  ? 'primary.main'
                                  : 'divider',
                            bgcolor:
                              i === currentQ
                                ? 'primary.main'
                                : answered
                                  ? 'primary.light'
                                  : 'background.paper',
                            color:
                              i === currentQ
                                ? '#fff'
                                : answered
                                  ? 'primary.dark'
                                  : 'text.secondary',
                          }}
                        >
                          {i + 1}
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>{tc('progress')}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.75 }}>
                  {t('answeredOf', { answered: answeredCount, total })}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={total === 0 ? 0 : (answeredCount / total) * 100}
                  sx={{ mb: 2 }}
                  color="primary"
                />
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={16} color="inherit" /> : t('submitEarly')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
