'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/auth-context'
import type {
  QuizAnswer,
  QuizQuestion,
  QuestionWithAnswers,
} from '@/components/manage-quiz/types'

const MAX_QUESTION_LEN = 1000
const MAX_ANSWER_LEN = 1000

type QuestionDialog =
  | { mode: 'create' }
  | { mode: 'edit'; question: QuizQuestion }
  | null

type AnswerDialog =
  | { mode: 'create'; questionId: number }
  | { mode: 'edit'; answer: QuizAnswer }
  | null

export default function ManageQuizPage() {
  const router = useRouter()
  const params = useParams<{ id: string; lessonId: string }>()
  const t = useTranslations('manageQuiz')
  const tl = useTranslations('manageLessons')
  const { user, loading: authLoading } = useAuth()
  const isTeacher = user?.role?.toUpperCase() === 'TEACHER'

  const courseId = Number(params?.id)
  const lessonId = Number(params?.lessonId)

  const [items, setItems] = useState<QuestionWithAnswers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [questionDialog, setQuestionDialog] = useState<QuestionDialog>(null)
  const [answerDialog, setAnswerDialog] = useState<AnswerDialog>(null)
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState<QuizQuestion | null>(null)
  const [confirmDeleteAnswer, setConfirmDeleteAnswer] = useState<QuizAnswer | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/login')
      return
    }
    if (!isTeacher || !lessonId) return
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, isTeacher, lessonId])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const qsRes = await fetch(`/api/question?lessonId=${lessonId}`)
      if (!qsRes.ok) {
        setError(t('loadFailed'))
        setItems([])
        return
      }
      const qs = (await qsRes.json()) as QuizQuestion[]
      const sorted = [...qs].sort((a, b) => a.sequence - b.sequence)
      const answersResults = await Promise.all(
        sorted.map((qq) => fetch(`/api/answer?questionId=${qq.id}`))
      )
      const next: QuestionWithAnswers[] = []
      for (let i = 0; i < sorted.length; i++) {
        const aRes = answersResults[i]
        const qq = sorted[i]
        if (!qq || !aRes || !aRes.ok) continue
        const answers = (await aRes.json()) as QuizAnswer[]
        next.push({ question: qq, answers })
      }
      setItems(next)
    } catch {
      setError(t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveQuestion(values: { question: string; sequence: number }) {
    setBusy(true)
    try {
      const url =
        questionDialog?.mode === 'edit'
          ? `/api/question/${questionDialog.question.id}`
          : '/api/question'
      const method = questionDialog?.mode === 'edit' ? 'PATCH' : 'POST'
      const body =
        questionDialog?.mode === 'edit'
          ? { question: values.question, sequence: values.sequence }
          : { ...values, lessonId }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message ?? t('saveFailed'))
      }
      setQuestionDialog(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : t('saveFailed'))
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteQuestion() {
    if (!confirmDeleteQuestion) return
    setBusy(true)
    try {
      const res = await fetch(`/api/question/${confirmDeleteQuestion.id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        setError(t('deleteFailed'))
        return
      }
      setConfirmDeleteQuestion(null)
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveAnswer(values: { answer: string; correct: boolean }) {
    if (!answerDialog) return
    setBusy(true)
    try {
      const url =
        answerDialog.mode === 'edit'
          ? `/api/answer/${answerDialog.answer.id}`
          : '/api/answer'
      const method = answerDialog.mode === 'edit' ? 'PATCH' : 'POST'
      const body =
        answerDialog.mode === 'edit'
          ? { answer: values.answer, correct: values.correct }
          : { ...values, questionId: answerDialog.questionId }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message ?? t('saveFailed'))
      }
      setAnswerDialog(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : t('saveFailed'))
    } finally {
      setBusy(false)
    }
  }

  async function handleDeleteAnswer() {
    if (!confirmDeleteAnswer) return
    setBusy(true)
    try {
      const res = await fetch(`/api/answer/${confirmDeleteAnswer.id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        setError(t('deleteFailed'))
        return
      }
      setConfirmDeleteAnswer(null)
      await load()
    } finally {
      setBusy(false)
    }
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  if (!isTeacher) {
    return (
      <DashboardLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Alert severity="warning">{t('forbidden')}</Alert>
        </Box>
      </DashboardLayout>
    )
  }

  const nextSequence =
    items.length === 0 ? 1 : Math.max(...items.map((i) => i.question.sequence)) + 1

  return (
    <DashboardLayout>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <IconButton
          size="small"
          onClick={() => router.push(`/courses/manage/${courseId}`)}
          aria-label={tl('back')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
            {t('title')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {t('subtitle')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontFamily: 'var(--font-serif), Georgia, serif' }}>
                {t('questions')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('questionsHint')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setQuestionDialog({ mode: 'create' })}
            >
              {t('createQuestion')}
            </Button>
          </Box>

          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography sx={{ fontSize: '2rem', mb: 1 }}>❓</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('emptyQuestions')}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {items.map((qa) => (
                <Card key={qa.question.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        mb: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Chip
                        label={tl('sequenceShort', { num: qa.question.sequence })}
                        size="small"
                        color="primary"
                        sx={{ height: 22, fontSize: '0.65rem', fontWeight: 600 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ flex: 1, fontWeight: 600, minWidth: 0 }}
                      >
                        {qa.question.question}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setQuestionDialog({ mode: 'edit', question: qa.question })}
                        aria-label={t('editQuestion')}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setConfirmDeleteQuestion(qa.question)}
                        aria-label={t('deleteQuestion')}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1 }}>
                      {qa.answers.length === 0 ? (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {t('emptyAnswers')}
                        </Typography>
                      ) : (
                        qa.answers.map((ans) => (
                          <Box
                            key={ans.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              px: 1.25,
                              py: 0.75,
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: ans.correct ? 'success.main' : 'divider',
                              bgcolor: ans.correct ? 'rgba(76,175,80,0.08)' : 'background.paper',
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2">{ans.answer}</Typography>
                            </Box>
                            {ans.correct && (
                              <Chip
                                label={t('correctChip')}
                                size="small"
                                color="success"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                              />
                            )}
                            <IconButton
                              size="small"
                              onClick={() => setAnswerDialog({ mode: 'edit', answer: ans })}
                              aria-label={t('editAnswer')}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setConfirmDeleteAnswer(ans)}
                              aria-label={t('deleteAnswer')}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))
                      )}
                    </Box>

                    <Button
                      size="small"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => setAnswerDialog({ mode: 'create', questionId: qa.question.id })}
                    >
                      {t('addAnswer')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <QuestionDialogComponent
        open={questionDialog !== null}
        mode={questionDialog?.mode ?? 'create'}
        initial={questionDialog?.mode === 'edit' ? questionDialog.question : null}
        defaultSequence={nextSequence}
        onSave={handleSaveQuestion}
        onClose={() => !busy && setQuestionDialog(null)}
        busy={busy}
      />

      <AnswerDialogComponent
        open={answerDialog !== null}
        mode={answerDialog?.mode ?? 'create'}
        initial={answerDialog?.mode === 'edit' ? answerDialog.answer : null}
        onSave={handleSaveAnswer}
        onClose={() => !busy && setAnswerDialog(null)}
        busy={busy}
      />

      <Dialog
        open={confirmDeleteQuestion !== null}
        onClose={() => !busy && setConfirmDeleteQuestion(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('deleteQuestionConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {confirmDeleteQuestion &&
              t('deleteQuestionConfirmBody', { question: confirmDeleteQuestion.question })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteQuestion(null)} disabled={busy}>
            {tl('cancel')}
          </Button>
          <Button onClick={handleDeleteQuestion} color="error" variant="contained" disabled={busy}>
            {busy ? <CircularProgress size={20} color="inherit" /> : tl('delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteAnswer !== null}
        onClose={() => !busy && setConfirmDeleteAnswer(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('deleteAnswerConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {confirmDeleteAnswer &&
              t('deleteAnswerConfirmBody', { answer: confirmDeleteAnswer.answer })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteAnswer(null)} disabled={busy}>
            {tl('cancel')}
          </Button>
          <Button onClick={handleDeleteAnswer} color="error" variant="contained" disabled={busy}>
            {busy ? <CircularProgress size={20} color="inherit" /> : tl('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}

function QuestionDialogComponent({
  open,
  mode,
  initial,
  defaultSequence,
  onSave,
  onClose,
  busy,
}: {
  open: boolean
  mode: 'create' | 'edit'
  initial: QuizQuestion | null
  defaultSequence: number
  onSave: (v: { question: string; sequence: number }) => void
  onClose: () => void
  busy: boolean
}) {
  const t = useTranslations('manageQuiz')
  const tl = useTranslations('manageLessons')
  const [text, setText] = useState('')
  const [sequenceStr, setSequenceStr] = useState('1')

  useEffect(() => {
    if (!open) return
    setText(initial?.question ?? '')
    setSequenceStr(String(initial?.sequence ?? defaultSequence ?? 1))
  }, [open, initial, defaultSequence])

  const seq = Math.max(1, Number(sequenceStr) || 0)
  const canSave = text.trim().length > 0 && seq >= 1

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? t('editQuestion') : t('createQuestion')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0.5 }}>
          <TextField
            label={t('questionText')}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_QUESTION_LEN))}
            fullWidth
            multiline
            minRows={2}
            required
            inputProps={{ maxLength: MAX_QUESTION_LEN }}
            helperText={`${text.length} / ${MAX_QUESTION_LEN}`}
          />
          <TextField
            label={tl('sequence')}
            value={sequenceStr}
            onChange={(e) => {
              const v = e.target.value
              if (v === '' || /^\d+$/.test(v)) setSequenceStr(v)
            }}
            required
            sx={{ width: 180 }}
            inputProps={{ inputMode: 'numeric' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          {tl('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave({ question: text.trim(), sequence: seq })}
          disabled={busy || !canSave}
        >
          {busy ? <CircularProgress size={20} color="inherit" /> : tl('save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function AnswerDialogComponent({
  open,
  mode,
  initial,
  onSave,
  onClose,
  busy,
}: {
  open: boolean
  mode: 'create' | 'edit'
  initial: QuizAnswer | null
  onSave: (v: { answer: string; correct: boolean }) => void
  onClose: () => void
  busy: boolean
}) {
  const t = useTranslations('manageQuiz')
  const tl = useTranslations('manageLessons')
  const [text, setText] = useState('')
  const [correct, setCorrect] = useState(false)

  useEffect(() => {
    if (!open) return
    setText(initial?.answer ?? '')
    setCorrect(initial?.correct ?? false)
  }, [open, initial])

  const canSave = text.trim().length > 0

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? t('editAnswer') : t('addAnswer')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0.5 }}>
          <TextField
            label={t('answerText')}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_ANSWER_LEN))}
            fullWidth
            multiline
            minRows={2}
            required
            inputProps={{ maxLength: MAX_ANSWER_LEN }}
            helperText={`${text.length} / ${MAX_ANSWER_LEN}`}
          />
          <FormControlLabel
            control={<Checkbox checked={correct} onChange={(e) => setCorrect(e.target.checked)} />}
            label={t('isCorrect')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          {tl('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave({ answer: text.trim(), correct })}
          disabled={busy || !canSave}
        >
          {busy ? <CircularProgress size={20} color="inherit" /> : tl('save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
