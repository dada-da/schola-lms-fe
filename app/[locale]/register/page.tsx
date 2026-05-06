'use client'
import { useState } from 'react'
import { useRouter, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import CastForEducationOutlinedIcon from '@mui/icons-material/CastForEducationOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useAuth } from '@/contexts/auth-context'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import Logo from '@/components/ui/Logo'

const centeredLabel = {
  InputLabelProps: {
    sx: {
      '&:not(.MuiInputLabel-shrink)': {
        top: '50%',
        transform: 'translate(14px, -50%) scale(1)',
      },
      '&.MuiInputLabel-shrink': {
        top: 0,
      },
    },
  },
}

export default function RegisterPage() {
  const t = useTranslations('register')
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError(t('passwordMismatch'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? t('networkError'))
      }
      await login(email, password)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Logo height={44} />
        </Box>

        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, textAlign: 'center' }}>
            {t('title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {t('subtitle')}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 1, color: 'text.secondary' }}>
                {t('role')}
              </Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(_, v) => v && setRole(v)}
                fullWidth
                size="small"
              >
                <ToggleButton value="STUDENT" sx={{ gap: 0.75, py: 1 }}>
                  <SchoolOutlinedIcon fontSize="small" />
                  {t('roleStudent')}
                </ToggleButton>
                <ToggleButton value="TEACHER" sx={{ gap: 0.75, py: 1 }}>
                  <CastForEducationOutlinedIcon fontSize="small" />
                  {t('roleTeacher')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <TextField
              {...centeredLabel}
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              autoFocus
            />

            <TextField
              {...centeredLabel}
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                      {showPassword
                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                        : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              {...centeredLabel}
              label={t('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              error={confirm.length > 0 && confirm !== password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" size="small">
                      {showConfirm
                        ? <VisibilityOffOutlinedIcon fontSize="small" />
                        : <VisibilityOutlinedIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.25 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : t('submit')}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2.5, color: 'text.secondary' }}>
            {t('haveAccount')}{' '}
            <Link href="/login" style={{ color: 'inherit', fontWeight: 600 }}>
              {t('signIn')}
            </Link>
          </Typography>
        </Paper>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher />
        </Box>
      </Box>
    </Box>
  )
}
