'use client'
import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Lesson } from '@/components/manage-lessons/types'

interface Props {
  lesson: Lesson
}

// Existing lessons can have content where HTML was pasted into the WYSIWYG as
// plain text — TipTap then wrapped each line in <p> and escaped the angle
// brackets, so we get "<p>&lt;h1&gt;Title&lt;/h1&gt;</p>" instead of "<h1>Title</h1>".
// Detect that shape, strip the bogus <p> wrappers around entity-encoded
// fragments, and decode. Real HTML passes through untouched.
function decodeIfEncoded(html: string): string {
  if (!html) return ''
  if (typeof document === 'undefined') return html

  const escapedTags = (html.match(/&lt;\/?[a-z]/gi) || []).length
  if (escapedTags === 0) return html

  const realTags = (html.match(/<[a-z][^>]*>/gi) || []).length
  // A few stray entities in otherwise real HTML (e.g. "use &lt;b&gt; for bold")
  // shouldn't trigger the unwrap.
  if (escapedTags < 3 && realTags > escapedTags) return html

  const unwrapped = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
    return /&lt;\/?[a-z]/i.test(inner) ? `${inner}\n` : match
  })
  const ta = document.createElement('textarea')
  ta.innerHTML = unwrapped
  return ta.value
}

const FORBIDDEN_EMBED_TAGS = ['iframe', 'video', 'embed', 'object'] as const

function stripEmbeds(html: string): string {
  if (!html || typeof DOMParser === 'undefined') return html
  if (!FORBIDDEN_EMBED_TAGS.some((tag) => new RegExp(`<${tag}\\b`, 'i').test(html))) return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  for (const tag of FORBIDDEN_EMBED_TAGS) {
    doc.body.querySelectorAll(tag).forEach((el) => el.remove())
  }
  return doc.body.innerHTML
}

export default function LessonTextContent({ lesson }: Props) {
  const html = useMemo(() => stripEmbeds(decodeIfEncoded(lesson.content || '')), [lesson.content])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>{lesson.title}</Typography>
      {lesson.description && (
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>{lesson.description}</Typography>
      )}
      <Box
        sx={{
          color: 'text.primary',
          fontSize: '1rem',
          lineHeight: 1.75,
          '& p': { my: 1 },
          '& p:first-of-type': { mt: 0 },
          '& p:last-of-type': { mb: 0 },
          '& h1': { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3, mt: 2.5, mb: 1 },
          '& h2': { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, mt: 2, mb: 1 },
          '& h3': { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, mt: 1.75, mb: 0.75 },
          '& h4': { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4, mt: 1.5, mb: 0.5 },
          '& strong, & b': { fontWeight: 700 },
          '& em, & i': { fontStyle: 'italic' },
          '& u': { textDecoration: 'underline' },
          '& s, & del': { textDecoration: 'line-through' },
          '& ul, & ol': { pl: 3, my: 1 },
          '& li': { my: 0.25 },
          '& li > p': { my: 0 },
          '& a': { color: 'primary.main', textDecoration: 'underline' },
          '& code': {
            bgcolor: 'action.hover',
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            fontFamily: 'monospace',
            fontSize: '0.875em',
          },
          '& pre': {
            bgcolor: 'grey.900',
            color: 'common.white',
            p: 1.5,
            borderRadius: 1,
            overflowX: 'auto',
            my: 1.5,
            fontSize: '0.9rem',
            '& code': { bgcolor: 'transparent', color: 'inherit', p: 0, fontSize: 'inherit' },
          },
          '& blockquote': {
            borderLeft: '3px solid',
            borderColor: 'divider',
            pl: 2,
            ml: 0,
            color: 'text.secondary',
            my: 1.5,
            '& p': { my: 0.5 },
          },
          '& hr': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: 'divider',
            my: 2,
          },
          '& img': { display: 'block', maxWidth: '100%', height: 'auto', borderRadius: 1, my: 1.5, mx: 'auto' },
          '& figure': { m: 0, my: 1.5 },
          '& iframe, & video': { display: 'block', maxWidth: '100%', height: 'auto', borderRadius: 1, my: 1.5 },
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            my: 2,
            fontSize: '0.95rem',
            display: 'block',
            overflowX: 'auto',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            px: 1.25,
            py: 1,
            textAlign: 'left',
            verticalAlign: 'top',
          },
          '& thead': { bgcolor: 'action.hover' },
          '& th': { fontWeight: 600 },
          '& tr:nth-of-type(even) td': { bgcolor: 'action.hover' },
          '& input[type="checkbox"]': { mr: 0.75, verticalAlign: 'middle' },
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Box>
  )
}
