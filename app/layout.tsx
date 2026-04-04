// Root layout — delegates to [locale]/layout.tsx for full rendering.
// This file exists only to satisfy Next.js's requirement for a root layout.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
