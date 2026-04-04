'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { routing } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('languageSwitcher')

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <Select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      size="small"
      sx={{
        fontSize: '0.8rem',
        height: 32,
        '& .MuiSelect-select': { py: 0.5, px: 1.5 },
      }}
    >
      {routing.locales.map((loc) => (
        <MenuItem key={loc} value={loc} sx={{ fontSize: '0.8rem' }}>
          {loc === 'en' ? '🇬🇧' : '🇻🇳'} {t(loc)}
        </MenuItem>
      ))}
    </Select>
  )
}
