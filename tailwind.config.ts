import type { Config } from 'tailwindcss'

const config: Config = {
  // Only scan app & component files — avoids conflicts with MUI styles
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  // Important: prefix Tailwind utilities so they don't clash with MUI's
  // class names (MUI uses its own internal class system via Emotion).
  // With `important: '#__next'`, Tailwind utilities get higher specificity
  // when applied inside the Next.js root element.
  important: '#__next',
  theme: {
    extend: {
      // Mirror the design tokens used in lib/theme.ts so Tailwind utilities
      // stay visually consistent with MUI components.
      colors: {
        ink: {
          DEFAULT: '#1a1a2e',
          soft: '#4a4a6a',
          muted: '#8888a8',
        },
        cream: {
          DEFAULT: '#faf9f6',
          dark: '#f0ede6',
        },
        teal: {
          DEFAULT: '#2d8a7a',
          light: '#e1f2ef',
          dark: '#1f6257',
        },
        rose: {
          DEFAULT: '#c4596a',
          light: '#faeaec',
        },
        gold: {
          DEFAULT: '#c8a96e',
          light: '#e8d5a8',
        },
        blue: {
          DEFAULT: '#3a6ea8',
          light: '#e8f0fa',
        },
        green: {
          DEFAULT: '#2d8a4a',
          light: '#e1f2e8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        pill: '100px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,26,46,0.06)',
        hover: '0 8px 24px rgba(26,26,46,0.12)',
      },
    },
  },
  plugins: [],
  // Disable Tailwind's preflight (CSS reset) to avoid overriding MUI's
  // baseline styles — MUI ships its own CssBaseline component.
  corePlugins: {
    preflight: false,
  },
}

export default config
