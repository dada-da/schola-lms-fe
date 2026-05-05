import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import DashboardLayout from '@/components/layout/DashboardLayout'

/**
 * loading.tsx — Shown by Next.js while a page is streaming / fetching.
 * Uses MUI Skeleton to match the real page layout.
 */
export default function Loading() {
  return (
    <DashboardLayout>
      <Box
        sx={{
          px: 3,
          py: 1.75,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 64,
        }}
      >
        <Box>
          <Skeleton variant="text" width={120} height={14} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width={220} height={26} />
        </Box>
        <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 100 }} />
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Card>
                <CardContent sx={{ p: '14px 18px !important' }}>
                  <Skeleton variant="text" width="60%" height={12} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="45%" height={36} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="70%" height={12} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width={140} height={18} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" width="100%" height={120} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Skeleton variant="text" width={100} height={18} sx={{ mb: 1.5 }} />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75 }}>
                    <Skeleton variant="circular" width={26} height={26} />
                    <Skeleton variant="text" sx={{ flex: 1 }} height={14} />
                    <Skeleton variant="text" width={50} height={14} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Skeleton variant="text" width={160} height={18} sx={{ mb: 1.5 }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: 1.5, flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="65%" height={14} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={12} />
                </Box>
                <Skeleton variant="rounded" width={70} height={8} sx={{ borderRadius: 100 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  )
}
