import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'

interface EmptyStateProps {
  emoji?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  sx?: SxProps<Theme>
}

/**
 * EmptyState — zero-results placeholder used in lists and search views.
 *
 * Usage:
 *   <EmptyState
 *     emoji="🔍"
 *     title="No courses found"
 *     description="Try adjusting your search or filters"
 *     action={{ label: 'Clear filters', onClick: handleClear }}
 *   />
 */
export default function EmptyState({ emoji = '📭', title, description, action, sx }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 10,
        px: 3,
        ...sx,
      }}
    >
      <Typography sx={{ fontSize: '3rem', mb: 1.5, lineHeight: 1 }}>{emoji}</Typography>
      <Typography
        variant="h6"
        sx={{ fontFamily: '"DM Serif Display", Georgia, serif', mb: 0.75 }}
      >
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 320 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          sx={{ mt: 2.5 }}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Box>
  )
}
