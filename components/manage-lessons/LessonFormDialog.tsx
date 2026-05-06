'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import RichTextEditor, { isHtmlEmpty } from './RichTextEditor'
import { extractYouTubeId, type ContentType, type LessonFormValues } from './types'

const MAX_TITLE_LEN = 255
const MAX_DESC_LEN = 1000

const EMPTY: LessonFormValues = {
  title: '',
  description: '',
  sequence: 1,
  durationMinutes: 0,
  content: '',
  contentType: 'TEXT',
}

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: LessonFormValues
  defaultSequence?: number
  onSave: (values: LessonFormValues) => Promise<void>
  onClose: () => void
}

export default function LessonFormDialog({
  open,
  mode,
  initialValues,
  defaultSequence,
  onSave,
  onClose,
}: Props) {
  const t = useTranslations('manageLessons')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sequenceStr, setSequenceStr] = useState('1')
  const [durationStr, setDurationStr] = useState('')
  const [content, setContent] = useState('')
  const [contentType, setContentType] = useState<ContentType>('TEXT')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const v = initialValues ?? { ...EMPTY, sequence: defaultSequence ?? 1 }
    setTitle(v.title)
    setDescription(v.description)
    setSequenceStr(String(v.sequence || 1))
    setDurationStr(v.durationMinutes ? String(v.durationMinutes) : '')
    setContent(v.content)
    setContentType(v.contentType)
    setError('')
  }, [open, initialValues, defaultSequence])

  const sequenceNum = Math.max(1, Number(sequenceStr) || 0)
  const durationNum = durationStr.trim() === '' ? 0 : Math.max(0, Number(durationStr) || 0)
  const isVideo = contentType === 'VIDEO'
  const trimmedContent = content.trim()
  const contentEmpty = isVideo ? trimmedContent.length === 0 : isHtmlEmpty(content)
  const videoIdValid = !isVideo || extractYouTubeId(trimmedContent) !== null
  const canSubmit =
    title.trim().length > 0 &&
    !contentEmpty &&
    sequenceNum >= 1 &&
    videoIdValid

  async function handleSave() {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        sequence: sequenceNum,
        durationMinutes: durationNum,
        content: isVideo ? trimmedContent : content,
        contentType,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    if (submitting) return
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>{mode === 'edit' ? t('editLesson') : t('createLesson')}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0.5 }}>
          <TextField
            label={t('lessonTitle')}
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LEN))}
            fullWidth
            autoFocus
            required
            inputProps={{ maxLength: MAX_TITLE_LEN }}
          />
          <TextField
            label={t('description')}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_LEN))}
            fullWidth
            multiline
            minRows={2}
            inputProps={{ maxLength: MAX_DESC_LEN }}
            helperText={`${description.length} / ${MAX_DESC_LEN}`}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={t('sequence')}
              value={sequenceStr}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || /^\d+$/.test(v)) setSequenceStr(v)
              }}
              required
              sx={{ flex: 1 }}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label={t('durationMinutes')}
              value={durationStr}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || /^\d+$/.test(v)) setDurationStr(v)
              }}
              sx={{ flex: 1 }}
              placeholder="0"
              InputLabelProps={{ shrink: true }}
              inputProps={{ inputMode: 'numeric' }}
              InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
            />
          </Box>
          <TextField
            select
            label={t('contentType')}
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            fullWidth
            required
          >
            <MenuItem value="TEXT">{t('contentTypeText')}</MenuItem>
            <MenuItem value="VIDEO">{t('contentTypeVideo')}</MenuItem>
          </TextField>
          {contentType === 'TEXT' ? (
            <Box>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}
              >
                {t('content')}
              </Typography>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder={t('contentTextHint')}
                disabled={submitting}
              />
            </Box>
          ) : (
            <TextField
              label={t('videoUrl')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              required
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              error={content.trim().length > 0 && !videoIdValid}
              helperText={
                content.trim().length > 0 && !videoIdValid
                  ? t('videoUrlInvalid')
                  : t('videoUrlHint')
              }
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>{t('cancel')}</Button>
        <Button onClick={handleSave} variant="contained" disabled={submitting || !canSubmit}>
          {submitting ? <CircularProgress size={20} color="inherit" /> : t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
