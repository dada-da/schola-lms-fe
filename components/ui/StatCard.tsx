import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaUp?: boolean
  /** Optional icon/emoji shown top-right */
  icon?: React.ReactNode
  /** Override card background e.g. for coloured stat strips */
  bgcolor?: string
  sx?: SxProps<Theme>
}

/**
 * StatCard — metric card used in dashboards.
 *
 * Usage:
 *   <StatCard label="Hours this week" value="14.5" delta="↑ 18%" deltaUp />
 *   <StatCard label="Day streak" value="23 🔥" delta="Personal best!" deltaUp />
 */
export default function StatCard({ label, value, delta, deltaUp, icon, bgcolor, sx }: StatCardProps) {
  return (
    <Card sx={{ bgcolor: bgcolor ?? 'background.paper', ...sx }}>
      <CardContent
        sx={{
          p: '14px 18px !important',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography
            variant="overline"
            sx={{ color: 'text.disabled', lineHeight: 1.4, display: 'block' }}
          >
            {label}
          </Typography>
          {icon && (
            <Box sx={{ fontSize: '1rem', lineHeight: 1, mt: 0.25, color: 'text.secondary' }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          sx={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: '2rem',
            lineHeight: 1.1,
            color: 'text.primary',
          }}
        >
          {value}
        </Typography>

        {delta && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: deltaUp === undefined ? 'text.secondary' : deltaUp ? 'success.main' : 'error.main',
            }}
          >
            {delta}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
