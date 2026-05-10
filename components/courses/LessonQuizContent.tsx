'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import type { Lesson } from '@/components/manage-lessons/types'
import type {
  QuestionWithAnswers,
  QuizAnswer,
  QuizAttemptResult,
  QuizQuestion,
} from '@/components/manage-quiz/types'

interface Props {
  lesson: Lesson
}

type Selections = Record<number, Set<number>>
type Locked = Record<number, boolean>

export default function LessonQuizContent({ lesson }: Props) {
  const t = useTranslations('quiz')
  const tc = useTranslations('common')

  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selections, setSelections] = useState<Selections>({})
  const [locked, setLocked] = useState<Locked>({})
  const [result, setResult] = useState<QuizAttemptResult | null>(null)
  const submittedRef = useRef(false)

  useEffect(() => {
    setQuestions([])
    setSelections({})
    setLocked({})
    setResult(null)
    setError('')
    submittedRef.current = false
    void load(lesson.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])

  async function load(lessonId: number) {
    setLoading(true)
    try {
      const qsRes = await fetch(`/api/question?lessonId=${lessonId}`)
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
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const total = questions.length
  const lockedCount = useMemo(
    () => questions.filter((qa) => locked[qa.question.id]).length,
    [questions, locked]
  )
  const correctCount = useMemo(() => {
    let n = 0
    for (const qa of questions) {
      if (!locked[qa.question.id]) continue
      const sel = selections[qa.question.id] ?? new Set<number>()
      const correctIds = new Set(qa.answers.filter((a) => a.correct).map((a) => a.id))
      if (sel.size === correctIds.size && [...sel].every((id) => correctIds.has(id))) n++
    }
    return n
  }, [questions, selections, locked])

  useEffect(() => {
    if (submittedRef.current) return
    if (total === 0 || lockedCount < total) return
    submittedRef.current = true
    void submitAttempt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedCount, total])

  async function submitAttempt() {
    try {
      const body = {
        lessonId: lesson.id,
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
      if (res.ok) {
        const data: QuizAttemptResult = await res.json()
        setResult(data)
      }
    } catch {
      // attempt recording is best-effort; UI feedback already shown
    }
  }

  function selectSingle(qa: QuestionWithAnswers, answerId: number) {
    if (locked[qa.question.id]) return
    setSelections((prev) => ({ ...prev, [qa.question.id]: new Set([answerId]) }))
    setLocked((prev) => ({ ...prev, [qa.question.id]: true }))
  }

  function toggleMulti(qa: QuestionWithAnswers, answerId: number) {
    if (locked[qa.question.id]) return
    setSelections((prev) => {
      const cur = new Set(prev[qa.question.id] ?? [])
      if (cur.has(answerId)) cur.delete(answerId)
      else cur.add(answerId)
      return { ...prev, [qa.question.id]: cur }
    })
  }

  function checkMulti(questionId: number) {
    setLocked((prev) => ({ ...prev, [questionId]: true }))
  }

  function reset() {
    setSelections({})
    setLocked({})
    setResult(null)
    submittedRef.current = false
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>{lesson.title}</Typography>
      {lesson.description && (
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>{lesson.description}</Typography>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {total === 0 ? (
        <Alert severity="info">{t('emptyQuiz')}</Alert>
      ) : (
        <>
          {result && (
            <Alert
              severity={result.correctCount === result.totalQuestions ? 'success' : 'info'}
              sx={{ mb: 2 }}
              action={
                <Button color="inherit" size="small" onClick={reset}>
                  {t('retakeQuiz')}
                </Button>
              }
            >
              {t('yourResult', { correct: result.correctCount, total: result.totalQuestions })}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {questions.map((qa, qIdx) => {
              const correctIds = new Set(qa.answers.filter((a) => a.correct).map((a) => a.id))
              const isMulti = correctIds.size >= 2
              const sel = selections[qa.question.id] ?? new Set<number>()
              const isLocked = !!locked[qa.question.id]
              const allCorrect =
                isLocked &&
                sel.size === correctIds.size &&
                [...sel].every((id) => correctIds.has(id))

              return (
                <Box
                  key={qa.question.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: { xs: 1.5, md: 2 },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="overline" sx={{ color: 'primary.main' }}>
                      {t('question', { num: qIdx + 1 })}
                    </Typography>
                    {isMulti && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        ({t('selectAll')})
                      </Typography>
                    )}
                    {isLocked && (
                      <Chip
                        size="small"
                        label={allCorrect ? tc('correct') : tc('incorrect')}
                        color={allCorrect ? 'success' : 'error'}
                        sx={{ ml: 'auto', height: 22 }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 500, mb: 1.5 }}>{qa.question.question}</Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {qa.answers.map((opt, i) => {
                      const picked = sel.has(opt.id)
                      const isCorrect = correctIds.has(opt.id)
                      const showCorrect = isLocked && isCorrect
                      const showWrong = isLocked && picked && !isCorrect
                      const borderColor = showCorrect
                        ? 'success.main'
                        : showWrong
                          ? 'error.main'
                          : picked
                            ? 'primary.main'
                            : 'divider'
                      const bgColor = showCorrect
                        ? 'success.light'
                        : showWrong
                          ? 'error.light'
                          : picked
                            ? 'primary.light'
                            : 'background.paper'
                      return (
                        <Box
                          key={opt.id}
                          onClick={() =>
                            isMulti ? toggleMulti(qa, opt.id) : selectSingle(qa, opt.id)
                          }
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.25,
                            borderRadius: 1.5,
                            border: '1.5px solid',
                            borderColor,
                            bgcolor: bgColor,
                            cursor: isLocked ? 'default' : 'pointer',
                            transition: 'all 0.15s',
                            '&:hover': isLocked
                              ? undefined
                              : { borderColor: 'primary.main', bgcolor: 'primary.light' },
                          }}
                        >
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: isMulti ? 1 : '50%',
                              bgcolor: picked ? 'primary.main' : 'background.default',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: picked ? '#fff' : 'text.secondary',
                            }}
                          >
                            {String.fromCharCode(65 + i)}
                          </Box>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {opt.answer}
                          </Typography>
                          {showCorrect && (
                            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                          {showWrong && <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />}
                        </Box>
                      )
                    })}
                  </Box>

                  {isMulti && !isLocked && (
                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        disabled={sel.size === 0}
                        onClick={() => checkMulti(qa.question.id)}
                      >
                        {tc('check')}
                      </Button>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          {lockedCount > 0 && (
            <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('answeredOf', { answered: lockedCount, total })} ·{' '}
                {tc('correct')}: {correctCount}
              </Typography>
              {lockedCount > 0 && (
                <Button size="small" variant="outlined" color="secondary" onClick={reset} sx={{ ml: 'auto' }}>
                  {t('retakeQuiz')}
                </Button>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
