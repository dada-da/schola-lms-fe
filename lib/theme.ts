'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d8a7a',
      light: '#e1f2ef',
      dark: '#1f6257',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1a1a2e',
      light: '#2e2e4e',
      dark: '#0d0d1a',
      contrastText: '#fff',
    },
    background: {
      default: '#faf9f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#4a4a6a',
      disabled: '#8888a8',
    },
    error: { main: '#c4596a' },
    warning: { main: '#c8a96e' },
    success: { main: '#2d8a4a' },
    info: { main: '#3a6ea8' },
    divider: 'rgba(26,26,46,0.1)',
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h2: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h3: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h4: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h5: { fontFamily: '"DM Serif Display", Georgia, serif', fontWeight: 400 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
    overline: { letterSpacing: '0.08em', fontWeight: 600, fontSize: '0.68rem' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(26,26,46,0.06)',
    '0 2px 8px rgba(26,26,46,0.08)',
    '0 4px 16px rgba(26,26,46,0.1)',
    '0 8px 24px rgba(26,26,46,0.12)',
    '0 12px 32px rgba(26,26,46,0.14)',
    ...Array(19).fill('none'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#faf9f6',
          scrollbarWidth: 'thin',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: '8px 20px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        sizeLarge: { padding: '12px 28px', fontSize: '0.95rem' },
        sizeSmall: { padding: '5px 14px', fontSize: '0.78rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(26,26,46,0.1)',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 100, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '0.05em' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 100, height: 6, backgroundColor: '#f0ede6' },
        bar: { borderRadius: 100 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 6 },
        input: { padding: '10px 16px' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#8888a8',
          borderBottom: '1px solid rgba(26,26,46,0.1)',
          padding: '10px 16px',
        },
        body: {
          fontSize: '0.875rem',
          borderBottom: '1px solid rgba(26,26,46,0.07)',
          padding: '12px 16px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          padding: '8px 12px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(45,138,122,0.15)',
            color: '#2d8a7a',
            '&:hover': { backgroundColor: 'rgba(45,138,122,0.2)' },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a2e',
          color: 'rgba(255,255,255,0.85)',
          border: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 44,
        },
      },
    },
  },
})

export default theme
