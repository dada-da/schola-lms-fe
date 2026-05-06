'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { routing } from '@/i18n/routing';

const flagFor = (loc: string) => (loc === 'en' ? '🇬🇧' : '🇻🇳');

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('languageSwitcher');

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      size="small"
      renderValue={(value) => flagFor(value as string)}
      IconComponent={() => null}
      sx={{
        fontSize: '0.8rem',
        height: 32,
        color: 'inherit',
        '& .MuiSelect-select': {
          py: 0.5,
          pl: 1.5,
          pr: '12px !important',
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiSvgIcon-root': { color: 'inherit' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'currentColor',
          opacity: 0.3,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'currentColor',
          opacity: 0.6,
        },
      }}
    >
      {routing.locales.map((loc) => (
        <MenuItem key={loc} value={loc} sx={{ fontSize: '0.8rem', gap: 0.75 }}>
          <span>{flagFor(loc)}</span>
          <span>{t(loc)}</span>
        </MenuItem>
      ))}
    </Select>
  );
}
