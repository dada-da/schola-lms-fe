import Box from '@mui/material/Box'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
