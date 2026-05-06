'use client'
import { useTranslations } from 'next-intl'
import ComingSoon from '@/components/ui/ComingSoon'

export default function AnalyticsPage() {
  const t = useTranslations('sidebar')
  return <ComingSoon title={t('analytics')} emoji="📊" />
}
