import type { Metadata } from 'next'
import ThemeRegistry from '@/components/layout/ThemeRegistry'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScholaLMS',
  description: 'Modern Learning Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="__next">
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
