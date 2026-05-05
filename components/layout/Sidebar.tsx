'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Logo from '@/components/ui/Logo'
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
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useAuth } from '@/contexts/auth-context'

const DRAWER_WIDTH = 224

type NavSection = { section: string }
type NavItem = { label: string; icon: React.ReactNode; href: string }
type NavEntry = NavSection | NavItem

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('sidebar')
  const { user, logout } = useAuth()

  const userInitials = user?.email.slice(0, 2).toUpperCase() ?? '??'
  const userLabel = user?.email ?? ''

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  const NAV: NavEntry[] = [
    { section: t('main') },
    { label: t('overview'), icon: <DashboardOutlinedIcon fontSize="small" />, href: '/dashboard' },
    { label: t('myCourses'), icon: <MenuBookOutlinedIcon fontSize="small" />, href: '/courses' },
    { label: t('schedule'), icon: <CalendarTodayOutlinedIcon fontSize="small" />, href: '#' },
    { label: t('aiTutor'), icon: <SmartToyOutlinedIcon fontSize="small" />, href: '#' },
    { section: t('progressSection') },
    { label: t('analytics'), icon: <BarChartOutlinedIcon fontSize="small" />, href: '#' },
    { label: t('certificates'), icon: <EmojiEventsOutlinedIcon fontSize="small" />, href: '#' },
    { label: t('goals'), icon: <TrackChangesOutlinedIcon fontSize="small" />, href: '#' },
    { section: t('communitySection') },
    { label: t('cohorts'), icon: <GroupsOutlinedIcon fontSize="small" />, href: '#' },
    { label: t('discussions'), icon: <ChatBubbleOutlineOutlinedIcon fontSize="small" />, href: '#' },
  ]

  const BOTTOM_NAV = [
    { label: t('admin'), icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />, href: '/admin' },
    { label: t('settings'), icon: <SettingsOutlinedIcon fontSize="small" />, href: '#' },
  ]

  const handleNav = (href: string) => {
    if (href !== '#') {
      router.push(href)
      onMobileClose?.()
    }
  }

  const content = (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        bgcolor: 'secondary.main',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 2,
        px: 1,
      }}
    >
      <Box sx={{ px: 1.5, mb: 3 }} onClick={() => onMobileClose?.()}>
        <Logo height={28} />
      </Box>

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
          const navItem = item as NavItem
          const active = navItem.href !== '#' && pathname.startsWith(navItem.href)
          return (
            <ListItemButton
              key={navItem.label}
              selected={active}
              onClick={() => handleNav(navItem.href)}
              sx={{
                color: active ? 'primary.main' : 'rgba(255,255,255,0.55)',
                '&:hover': { color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(255,255,255,0.07)' },
                '&.Mui-selected': { bgcolor: 'rgba(45,138,122,0.18)', color: 'primary.main' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{navItem.icon}</ListItemIcon>
              <ListItemText primary={navItem.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 500 : 400 }} />
            </ListItemButton>
          )
        })}
      </List>

      <Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />
        <List dense disablePadding>
          {BOTTOM_NAV.map((item) => {
            const active = item.href !== '#' && pathname.startsWith(item.href)
            return (
              <ListItemButton
                key={item.label}
                selected={active}
                onClick={() => handleNav(item.href)}
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
        <Box sx={{ px: 1.5, pt: 1, mb: 1 }}>
          <LanguageSwitcher />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, pt: 1.5, mt: 0.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.72rem', fontWeight: 600 }}>
            {userInitials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userLabel}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>
              {user?.role?.toLowerCase() ?? '—'}
            </Typography>
          </Box>
          <IconButton
            onClick={handleLogout}
            size="small"
            title="Sign out"
            sx={{ color: 'rgba(255,255,255,0.35)', '&:hover': { color: 'rgba(255,255,255,0.85)' } }}
          >
            <LogoutOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      <Box
        component="nav"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
        }}
      >
        {content}
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {content}
      </Drawer>
    </>
  )
}
