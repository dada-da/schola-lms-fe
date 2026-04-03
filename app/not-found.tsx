import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

/**
 * not-found.tsx — Rendered by Next.js when notFound() is called
 * or the route simply doesn't exist.
 */
export default function NotFound() {
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
      {/* Logo */}
      <Typography
        sx={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: '1.25rem',
          color: '#1a1a2e',
          mb: 4,
        }}
      >
        Schola<Box component="span" sx={{ color: '#2d8a7a' }}>LMS</Box>
      </Typography>

      {/* Illustration */}
      <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>🗺️</Typography>

      {/* Heading */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: { xs: '3rem', md: '5rem' },
          color: '#1a1a2e',
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          color: '#1a1a2e',
          mb: 1.5,
        }}
      >
        Page not found
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: '#4a4a6a', maxWidth: 380, lineHeight: 1.75, mb: 4 }}
      >
        Looks like this lesson doesn&apos;t exist yet. Head back to the dashboard
        and pick up where you left off.
      </Typography>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          component={Link}
          href="/dashboard"
          variant="contained"
          color="primary"
          size="large"
        >
          Go to dashboard
        </Button>
        <Button
          component={Link}
          href="/courses"
          variant="outlined"
          color="secondary"
          size="large"
        >
          Browse courses
        </Button>
      </Box>
    </Box>
  )
}
