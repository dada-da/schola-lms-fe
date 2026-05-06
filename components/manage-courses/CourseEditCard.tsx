'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import InputAdornment from '@mui/material/InputAdornment'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { Category, CourseFormValues } from './types'

const MAX_TAGS = 10
const MAX_TAG_LEN = 64
const MAX_TITLE_LEN = 255
const MAX_DESC_LEN = 1000
const MAX_URL_LEN = 1000

interface Props {
  initialValues: CourseFormValues
  categories: Category[]
  onSave: (values: CourseFormValues) => Promise<void>
  defaultExpanded?: boolean
}

export default function CourseEditCard({
  initialValues,
  categories,
  onSave,
  defaultExpanded = true,
}: Props) {
  const t = useTranslations('manageCourses')

  const [expanded, setExpanded] = useState(defaultExpanded)
  const [title, setTitle] = useState(initialValues.title)
  const [description, setDescription] = useState(initialValues.description)
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues.thumbnailUrl)
  const [priceStr, setPriceStr] = useState(
    initialValues.price ? String(initialValues.price) : ''
  )
  const [category, setCategory] = useState(initialValues.category)
  const [tags, setTags] = useState<string[]>(initialValues.tags)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setTitle(initialValues.title)
    setDescription(initialValues.description)
    setThumbnailUrl(initialValues.thumbnailUrl)
    setPriceStr(initialValues.price ? String(initialValues.price) : '')
    setCategory(initialValues.category)
    setTags(initialValues.tags)
    setError('')
    setSuccess(false)
  }, [initialValues])

  const currentValues: CourseFormValues = {
    title: title.trim(),
    description: description.trim(),
    thumbnailUrl: thumbnailUrl.trim(),
    price: priceStr.trim() === '' ? 0 : Number(priceStr),
    category,
    tags,
  }

  const dirty =
    currentValues.title !== initialValues.title.trim() ||
    currentValues.description !== initialValues.description.trim() ||
    currentValues.thumbnailUrl !== initialValues.thumbnailUrl.trim() ||
    currentValues.price !== initialValues.price ||
    currentValues.category !== initialValues.category ||
    currentValues.tags.length !== initialValues.tags.length ||
    currentValues.tags.some((tag, i) => tag !== initialValues.tags[i])

  const canSubmit = title.trim().length > 0 && category.length > 0 && dirty

  async function handleSave() {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    setSuccess(false)
    try {
      await onSave(currentValues)
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('saveFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setTitle(initialValues.title)
    setDescription(initialValues.description)
    setThumbnailUrl(initialValues.thumbnailUrl)
    setPriceStr(initialValues.price ? String(initialValues.price) : '')
    setCategory(initialValues.category)
    setTags(initialValues.tags)
    setError('')
    setSuccess(false)
  }

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: expanded ? 2 : 0, '&:last-child': { pb: expanded ? 2 : 1.5 } }}>
        <Box
          onClick={() => setExpanded((v) => !v)}
          role="button"
          aria-expanded={expanded}
          aria-controls="course-edit-form-body"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            cursor: 'pointer',
            userSelect: 'none',
            mx: -1,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontFamily: 'var(--font-serif), Georgia, serif' }}>
              {t('courseDetails')}
            </Typography>
            {dirty && !submitting && (
              <Chip
                label={t('unsavedChanges')}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          <IconButton
            size="small"
            aria-label={expanded ? t('collapse') : t('expand')}
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((v) => !v)
            }}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} unmountOnExit>
          <Box
            id="course-edit-form-body"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {success && !dirty && <Alert severity="success">{t('saveSuccess')}</Alert>}

            <TextField
              label={t('courseTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LEN))}
              fullWidth
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

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label={t('category')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            sx={{ flex: 1, minWidth: 200 }}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="" disabled>
              <em>{t('selectCategory')}</em>
            </MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.name} value={c.name}>
                {c.displayName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('price')}
            value={priceStr}
            onChange={(e) => {
              const v = e.target.value
              if (v === '' || /^\d*\.?\d*$/.test(v)) setPriceStr(v)
            }}
            sx={{ flex: 1, minWidth: 200 }}
            placeholder="0.00"
            InputLabelProps={{ shrink: true }}
            inputProps={{ inputMode: 'decimal' }}
            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
          />
        </Box>

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

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
              <Button onClick={handleReset} disabled={!dirty || submitting}>
                {t('reset')}
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={!canSubmit || submitting}
              >
                {submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t('saveChanges')
                )}
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
