'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        {/* Mobile top bar */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            bgcolor: 'secondary.main',
          }}
        >
          <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.1rem', color: '#fff' }}>
            Schola<Box component="span" sx={{ color: 'primary.main' }}>LMS</Box>
          </Box>
        </Box>

        {children}
      </Box>
    </Box>
  )
}
