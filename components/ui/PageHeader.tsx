'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useRouter } from 'next/navigation'

interface Crumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
  /** Slot for action buttons on the right */
  actions?: React.ReactNode
}

/**
 * PageHeader — sticky top bar used on every dashboard page.
 *
 * Usage:
 *   <PageHeader
 *     title="My Courses"
 *     subtitle="4 courses in progress"
 *     breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Courses' }]}
 *     actions={<Button variant="contained">Enroll</Button>}
 *   />
 */
export default function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  const router = useRouter()

  return (
    <Box
      component="header"
      sx={{
        px: 3,
        py: 1.75,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        minHeight: 64,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ mb: 0.25, '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}
          >
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1
              return isLast ? (
                <Typography
                  key={crumb.label}
                  variant="caption"
                  sx={{ color: 'text.primary' }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.label}
                  component="button"
                  variant="caption"
                  underline="hover"
                  sx={{ color: 'text.secondary', cursor: 'pointer' }}
                  onClick={() => crumb.href && router.push(crumb.href)}
                >
                  {crumb.label}
                </Link>
              )
            })}
          </Breadcrumbs>
        )}

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontSize: '1.35rem',
            fontFamily: '"DM Serif Display", Georgia, serif',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.1, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Right-side actions */}
      {actions && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
          {actions}
        </Box>
      )}
    </Box>
  )
}
