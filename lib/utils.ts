/**
 * utils.ts — Shared utility functions.
 */

// ─── Formatting ────────────────────────────────────────────────────────────

/** Format seconds as M:SS  e.g. 95 → "1:35" */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Format a number with locale-aware thousands separators */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n)
}

/** Format a dollar amount  e.g. 47200 → "$47.2k" */
export function formatCurrency(cents: number, compact = false): string {
  if (compact && cents >= 1000) {
    return `$${(cents / 1000).toFixed(1)}k`
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents)
}

/** Relative time string  e.g. "2 hours ago" */
export function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Strings ───────────────────────────────────────────────────────────────

/** Get initials from a full name  e.g. "Alex Minh" → "AM" */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

/** Truncate a string with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength - 1)}…`
}

/** Convert a title to a URL-safe slug  e.g. "Hello World!" → "hello-world" */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Arrays ────────────────────────────────────────────────────────────────

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Shuffle an array (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j] as T, a[i] as T]
  }
  return a
}

// ─── DOM / colour ──────────────────────────────────────────────────────────

/**
 * Returns a deterministic avatar background colour from a string seed.
 * Useful for generated avatars with consistent colours per user.
 */
const AVATAR_COLORS = [
  '#2d8a7a', '#3a6ea8', '#c4596a', '#c8a96e',
  '#2d8a4a', '#9c5dd1', '#c45986', '#5d8ac4',
]

export function avatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!
}

// ─── Course helpers ────────────────────────────────────────────────────────

/** Returns true if the course has been started but not completed */
export function isInProgress(progress: number): boolean {
  return progress > 0 && progress < 100
}

/** Returns the level badge colour */
export function levelColor(level: string): { bg: string; text: string } {
  switch (level) {
    case 'Beginner':     return { bg: '#e1f2ef', text: '#1f6257' }
    case 'Intermediate': return { bg: '#e8f0fa', text: '#1d4f7a' }
    case 'Advanced':     return { bg: '#faeaec', text: '#8a3040' }
    default:             return { bg: '#f0ede6', text: '#4a4a6a' }
  }
}
