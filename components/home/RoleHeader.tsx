import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import type { AuthUser } from '@/contexts/auth-context'

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  ADMIN:   { bg: '#faeaec', color: '#8a3040' },
  TEACHER: { bg: '#e8f0fa', color: '#1d4f7a' },
  STUDENT: { bg: '#e1f2ef', color: '#1f6257' },
}

export default function RoleHeader({ user, subtitle }: { user: AuthUser; subtitle: string }) {
  const chip = ROLE_COLORS[user.role.toUpperCase()] ?? ROLE_COLORS.STUDENT

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 40 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.25 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
          Welcome back, <Box component="span" sx={{ color: 'primary.main' }}>{user.email}</Box>
        </Typography>
        <Chip
          label={user.role}
          size="small"
          sx={{ bgcolor: chip?.bg, color: chip?.color, fontWeight: 700, fontSize: '0.65rem', height: 20 }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
    </Box>
  )
}
