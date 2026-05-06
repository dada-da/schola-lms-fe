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
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { Category, CourseFormValues } from './types'

const MAX_TAGS = 10
const MAX_TAG_LEN = 64
const MAX_TITLE_LEN = 255
const MAX_DESC_LEN = 1000
const MAX_URL_LEN = 1000

const EMPTY: CourseFormValues = {
  title: '',
  description: '',
  thumbnailUrl: '',
  price: 0,
  category: '',
  tags: [],
}

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: CourseFormValues
  categories: Category[]
  onSave: (values: CourseFormValues) => Promise<void>
  onClose: () => void
}

export default function CourseFormDialog({
  open,
  mode,
  initialValues,
  categories,
  onSave,
  onClose,
}: Props) {
  const t = useTranslations('manageCourses')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [priceStr, setPriceStr] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const v = initialValues ?? EMPTY
    setTitle(v.title)
    setDescription(v.description)
    setThumbnailUrl(v.thumbnailUrl)
    setPriceStr(v.price ? String(v.price) : '')
    setCategory(v.category)
    setTags(v.tags)
    setError('')
  }, [open, initialValues])

  const canSubmit = title.trim().length > 0 && category.length > 0

  async function handleSave() {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        price: priceStr.trim() === '' ? 0 : Number(priceStr),
        category,
        tags,
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
      <DialogTitle>{mode === 'edit' ? t('editCourse') : t('createCourse')}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 0.5 }}>
          <TextField
            label={t('courseTitle')}
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
            minRows={3}
            inputProps={{ maxLength: MAX_DESC_LEN }}
            helperText={`${description.length} / ${MAX_DESC_LEN}`}
          />
          <TextField
            select
            label={t('category')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              <em>{t('selectCategory')}</em>
            </MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.name} value={c.name}>{c.displayName}</MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('thumbnailUrl')}
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value.slice(0, MAX_URL_LEN))}
            fullWidth
            type="url"
            placeholder="https://example.com/image.jpg"
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: MAX_URL_LEN }}
          />
          <TextField
            label={t('price')}
            value={priceStr}
            onChange={(e) => {
              const v = e.target.value
              if (v === '' || /^\d*\.?\d*$/.test(v)) setPriceStr(v)
            }}
            fullWidth
            placeholder="0.00"
            InputLabelProps={{ shrink: true }}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={tags}
            onChange={(_, v) => {
              const cleaned = v
                .map((s) => (typeof s === 'string' ? s.trim() : '').slice(0, MAX_TAG_LEN))
                .filter((s) => s.length > 0)
              setTags(Array.from(new Set(cleaned)).slice(0, MAX_TAGS))
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, i) => {
                const { key, ...chipProps } = getTagProps({ index: i })
                return <Chip key={key} variant="outlined" label={option} size="small" {...chipProps} />
              })
            }
            renderInput={(params) => (
              <TextField {...params} label={t('tags')} helperText={t('tagsHint')} />
            )}
          />
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
