import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Be_Vietnam_Pro, Playfair_Display } from 'next/font/google'
import { routing } from '@/i18n/routing'
import ThemeRegistry from '@/components/layout/ThemeRegistry'
import { AuthProvider } from '@/contexts/auth-context'
import '../globals.css'

const sansFont = Be_Vietnam_Pro({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const serifFont = Playfair_Display({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ScholaLMS',
  description: 'Modern Learning Management System',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${sansFont.variable} ${serifFont.variable}`}>
      <body id="__next">
        <NextIntlClientProvider messages={messages}>
          <ThemeRegistry>
            <AuthProvider>{children}</AuthProvider>
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
