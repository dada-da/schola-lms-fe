import Image from 'next/image'
import Link from 'next/link'

const ASPECT = 3098 / 1344

export default function Logo({ height = 32 }: { height?: number }) {
  const width = Math.round(height * ASPECT)
  return (
    <Link href="/" aria-label="ScholaLMS — home" style={{ display: 'inline-flex', lineHeight: 0 }}>
      <Image
        src="/logo.svg"
        alt="ScholaLMS"
        width={width}
        height={height}
        priority
        style={{ display: 'block', width: 'auto', height }}
      />
    </Link>
  )
}
