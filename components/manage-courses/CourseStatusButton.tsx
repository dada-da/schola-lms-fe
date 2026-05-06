'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import {
  COURSE_STATUSES,
  normalizeCourseStatus,
  type CourseStatus,
} from './types'

const STATUS_COLOR: Record<CourseStatus, 'inherit' | 'success' | 'warning'> = {
  DRAFT: 'inherit',
  PUBLISHED: 'success',
  ARCHIVED: 'warning',
}

const STATUS_DOT: Record<CourseStatus, string> = {
  DRAFT: 'text.disabled',
  PUBLISHED: 'success.main',
  ARCHIVED: 'warning.main',
}

interface Props {
  status: CourseStatus | string | undefined
  onChange: (status: CourseStatus) => Promise<void>
  disabled?: boolean
}

export default function CourseStatusButton({ status, onChange, disabled }: Props) {
  const t = useTranslations('manageCourses')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [updating, setUpdating] = useState(false)
  const open = Boolean(anchorEl)

  const current = normalizeCourseStatus(status)

  async function handleSelect(next: CourseStatus) {
    setAnchorEl(null)
    if (next === current) return
    setUpdating(true)
    try {
      await onChange(next)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color={STATUS_COLOR[current]}
        disabled={disabled || updating}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={
          updating ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: STATUS_DOT[current],
              }}
            />
          )
        }
        endIcon={<ExpandMoreIcon fontSize="small" />}
        sx={{ textTransform: 'none', fontWeight: 600 }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {t(`status.${current}`)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {COURSE_STATUSES.map((s) => (
          <MenuItem key={s} onClick={() => handleSelect(s)} selected={s === current}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {s === current ? (
                <CheckIcon fontSize="small" />
              ) : (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: STATUS_DOT[s],
                    ml: 0.5,
                  }}
                />
              )}
            </ListItemIcon>
            {t(`status.${s}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
