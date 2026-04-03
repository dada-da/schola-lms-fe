'use client'
import { usePathname, useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'

const DRAWER_WIDTH = 224

const NAV = [
  { section: 'Main' },
  { label: 'Overview', icon: <DashboardOutlinedIcon fontSize="small" />, href: '/dashboard' },
  { label: 'My Courses', icon: <MenuBookOutlinedIcon fontSize="small" />, href: '/courses' },
  { label: 'Schedule', icon: <CalendarTodayOutlinedIcon fontSize="small" />, href: '#' },
  { label: 'AI Tutor', icon: <SmartToyOutlinedIcon fontSize="small" />, href: '#' },
  { section: 'Progress' },
  { label: 'Analytics', icon: <BarChartOutlinedIcon fontSize="small" />, href: '#' },
  { label: 'Certificates', icon: <EmojiEventsOutlinedIcon fontSize="small" />, href: '#' },
  { label: 'Goals', icon: <TrackChangesOutlinedIcon fontSize="small" />, href: '#' },
  { section: 'Community' },
  { label: 'Cohorts', icon: <GroupsOutlinedIcon fontSize="small" />, href: '#' },
  { label: 'Discussions', icon: <ChatBubbleOutlineOutlinedIcon fontSize="small" />, href: '#' },
]

const BOTTOM_NAV = [
  { label: 'Admin', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />, href: '/admin' },
  { label: 'Settings', icon: <SettingsOutlinedIcon fontSize="small" />, href: '#' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Box
      component="nav"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        bgcolor: 'secondary.main',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        py: 2,
        px: 1,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 1.5, mb: 3 }}>
        <Typography
          sx={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '1.25rem', color: '#fff', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          Schola<Box component="span" sx={{ color: 'primary.main' }}>LMS</Box>
        </Typography>
      </Box>

      {/* Main nav */}
      <List dense disablePadding sx={{ flex: 1, overflow: 'auto' }}>
        {NAV.map((item, i) => {
          if ('section' in item) {
            return (
              <Typography
                key={i}
                variant="overline"
                sx={{ color: 'rgba(255,255,255,0.3)', px: 1.5, mt: i === 0 ? 0 : 2, mb: 0.5, display: 'block' }}
              >
                {item.section}
              </Typography>
            )
          }
          const active = item.href !== '#' && pathname.startsWith(item.href)
          return (
            <ListItemButton
              key={item.label}
              selected={active}
              onClick={() => item.href !== '#' && router.push(item.href)}
              sx={{
                color: active ? 'primary.main' : 'rgba(255,255,255,0.55)',
                '&:hover': { color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(255,255,255,0.07)' },
                '&.Mui-selected': { bgcolor: 'rgba(45,138,122,0.18)', color: 'primary.main' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 500 : 400 }} />
            </ListItemButton>
          )
        })}
      </List>

      {/* Bottom */}
      <Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />
        <List dense disablePadding>
          {BOTTOM_NAV.map((item) => {
            const active = item.href !== '#' && pathname.startsWith(item.href)
            return (
              <ListItemButton
                key={item.label}
                selected={active}
                onClick={() => item.href !== '#' && router.push(item.href)}
                sx={{
                  color: active ? 'primary.main' : 'rgba(255,255,255,0.55)',
                  '&:hover': { color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(255,255,255,0.07)' },
                  '&.Mui-selected': { bgcolor: 'rgba(45,138,122,0.18)', color: 'primary.main' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
            )
          })}
        </List>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, pt: 1.5, mt: 0.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.72rem', fontWeight: 600 }}>AM</Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, lineHeight: 1.2 }}>Alex Minh</Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>Pro learner</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
