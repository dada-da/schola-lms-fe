'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import Logo from '@/components/ui/Logo'

type NavLink = { label: string; href: string; type: 'anchor' | 'route' }

export default function GuestNav() {
  const router = useRouter()
  const pathname = usePathname()
  const tc = useTranslations('common')
  const [mobileOpen, setMobileOpen] = useState(false)

  const onHome = pathname === '/'
  const links: NavLink[] = [
    { label: tc('features'), href: onHome ? '#features' : '/#features', type: onHome ? 'anchor' : 'route' },
    { label: tc('courses'), href: '/browse', type: 'route' },
    { label: tc('pricing'), href: onHome ? '#pricing' : '/#pricing', type: onHome ? 'anchor' : 'route' },
  ]

  const handleClick = (link: NavLink) => {
    setMobileOpen(false)
    if (link.type === 'route') router.push(link.href)
  }

  return (
    <Box component="nav" sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: '#faf9f6', borderBottom: '1px solid rgba(26,26,46,0.08)', px: { xs: 2, md: 4 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Logo height={36} />
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
        {links.map(l => l.type === 'anchor' ? (
          <Typography key={l.href} component="a" href={l.href} sx={{ fontSize: '0.875rem', color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>{l.label}</Typography>
        ) : (
          <Typography key={l.href} component="button" onClick={() => handleClick(l)} sx={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit', fontSize: '0.875rem', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>{l.label}</Typography>
        ))}
        <LanguageSwitcher />
        <Button variant="outlined" size="small" color="secondary" onClick={() => router.push('/login')}>{tc('signIn')}</Button>
        <Button variant="contained" size="small" color="primary" onClick={() => router.push('/login')}>{tc('startFree')}</Button>
      </Box>
      <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setMobileOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 260 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
          <Logo height={28} />
          <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <List>
          {links.map(l => l.type === 'anchor' ? (
            <ListItemButton key={l.href} component="a" href={l.href} onClick={() => setMobileOpen(false)}>
              <ListItemText primary={l.label} />
            </ListItemButton>
          ) : (
            <ListItemButton key={l.href} onClick={() => handleClick(l)}>
              <ListItemText primary={l.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <LanguageSwitcher />
          <Button fullWidth variant="outlined" color="secondary" onClick={() => { router.push('/login'); setMobileOpen(false) }}>{tc('signIn')}</Button>
          <Button fullWidth variant="contained" color="primary" onClick={() => { router.push('/login'); setMobileOpen(false) }}>{tc('startFree')}</Button>
        </Box>
      </Drawer>
    </Box>
  )
}
