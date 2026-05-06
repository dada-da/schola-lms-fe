'use client'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useRouter } from '@/i18n/navigation'

interface Props {
  title: string
  description?: string
  emoji?: string
}

export default function ComingSoon({ title, description, emoji }: Props) {
  const t = useTranslations('comingSoon')
  const router = useRouter()

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: 'calc(100vh - 120px)',
          px: 3,
          py: 8,
        }}
      >
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
            fontSize: '2.5rem',
          }}
        >
          {emoji ?? <ConstructionOutlinedIcon sx={{ fontSize: '2.5rem' }} />}
        </Box>

        <Chip
          label={t('badge')}
          size="small"
          color="primary"
          sx={{ mb: 1.5, fontWeight: 600 }}
        />

        <Typography
          variant="h4"
          sx={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            mb: 1,
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', maxWidth: 460, mb: 4 }}
        >
          {description ?? t('description')}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
        >
          {t('backToDashboard')}
        </Button>
      </Box>
    </DashboardLayout>
  )
}
