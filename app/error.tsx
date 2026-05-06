'use client'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#faf9f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography sx={{ fontSize: '3.5rem', mb: 2, lineHeight: 1 }}>⚠️</Typography>
      <Typography
        variant="h4"
        sx={{ fontFamily: 'var(--font-serif), Georgia, serif', mb: 1.5 }}
      >
        Something went wrong
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: '#4a4a6a', maxWidth: 360, lineHeight: 1.75, mb: 4 }}
      >
        An unexpected error occurred. Our team has been notified. Try refreshing
        the page, or head back to the dashboard.
      </Typography>
      {process.env.NODE_ENV === 'development' && error.digest && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 3,
            px: 2,
            py: 1,
            bgcolor: '#faeaec',
            color: '#8a3040',
            borderRadius: 1,
            fontFamily: 'monospace',
          }}
        >
          digest: {error.digest}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" size="large" onClick={reset}>
          Try again
        </Button>
        <Button variant="outlined" color="secondary" size="large" href="/dashboard">
          Go to dashboard
        </Button>
      </Box>
    </Box>
  )
}
