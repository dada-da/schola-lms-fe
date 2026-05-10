'use client'
import { useEffect } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { DOMParser as PMDOMParser } from '@tiptap/pm/model'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'
import DataObjectIcon from '@mui/icons-material/DataObject'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'

const FORBIDDEN_EMBED_TAGS = ['iframe', 'video', 'embed', 'object'] as const

function stripEmbeds(root: HTMLElement): HTMLElement {
  for (const tag of FORBIDDEN_EMBED_TAGS) {
    root.querySelectorAll(tag).forEach((el) => el.remove())
  }
  return root
}

function stripEmbedsFromHtml(html: string): string {
  if (!html || typeof DOMParser === 'undefined') return html ?? ''
  if (!FORBIDDEN_EMBED_TAGS.some((tag) => new RegExp(`<${tag}\\b`, 'i').test(html))) return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return stripEmbeds(doc.body).innerHTML
}

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number | string
  disabled?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 200,
  disabled = false,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: stripEmbedsFromHtml(value || ''),
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(stripEmbedsFromHtml(editor.getHTML())),
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
      },
      // When users paste HTML source (e.g. from a code editor), the clipboard
      // typically only carries text/plain. ProseMirror's default handler then
      // wraps each line in <p> and entity-escapes the angle brackets — so
      // "<h1>Title</h1>" gets stored as "<p>&lt;h1&gt;Title&lt;/h1&gt;</p>".
      // Detect that case and re-route through the HTML parser instead.
      // Also strip embed tags (iframe/video/embed/object) from clipboard HTML
      // before ProseMirror sees them, so videos can never enter the document.
      handlePaste(view, event) {
        const data = event.clipboardData
        if (!data) return false
        const html = data.getData('text/html')
        if (html.trim()) {
          const hasEmbed = FORBIDDEN_EMBED_TAGS.some((tag) =>
            new RegExp(`<${tag}\\b`, 'i').test(html)
          )
          if (!hasEmbed) return false
          try {
            const dom = new DOMParser().parseFromString(html, 'text/html').body
            stripEmbeds(dom)
            const slice = PMDOMParser.fromSchema(view.state.schema).parseSlice(dom)
            view.dispatch(view.state.tr.replaceSelection(slice))
            return true
          } catch {
            return false
          }
        }
        const text = data.getData('text/plain')
        const trimmed = text.trim()
        const looksLikeHtml = /^<[a-z!]/i.test(trimmed) && /<\/[a-z][a-z0-9]*\s*>\s*$/i.test(trimmed)
        if (!looksLikeHtml) return false
        try {
          const dom = new DOMParser().parseFromString(text, 'text/html').body
          stripEmbeds(dom)
          const slice = PMDOMParser.fromSchema(view.state.schema).parseSlice(dom)
          view.dispatch(view.state.tr.replaceSelection(slice))
          return true
        } catch {
          return false
        }
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.isDestroyed) return
    const sanitized = stripEmbedsFromHtml(value || '')
    if (sanitized === editor.getHTML()) return
    editor.commands.setContent(sanitized, { emitUpdate: false })
  }, [value, editor])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
        },
        '& .rich-text-editor-content': {
          outline: 'none',
          px: 1.5,
          py: 1,
          minHeight,
          fontSize: '0.95rem',
          lineHeight: 1.6,
          '& p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            color: 'text.disabled',
            pointerEvents: 'none',
            float: 'left',
            height: 0,
          },
          '& p': { my: 0.5 },
          '& h1': { fontSize: '1.5rem', fontWeight: 600, mt: 1.5, mb: 0.75 },
          '& h2': { fontSize: '1.25rem', fontWeight: 600, mt: 1.5, mb: 0.5 },
          '& h3': { fontSize: '1.05rem', fontWeight: 600, mt: 1.25, mb: 0.5 },
          '& ul, & ol': { pl: 3, my: 0.5 },
          '& blockquote': {
            borderLeft: '3px solid',
            borderColor: 'divider',
            pl: 1.5,
            ml: 0,
            color: 'text.secondary',
            my: 0.5,
          },
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
            overflow: 'auto',
            my: 1,
            '& code': { bgcolor: 'transparent', color: 'inherit', p: 0 },
          },
          '& a': { color: 'primary.main', textDecoration: 'underline' },
          '& hr': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: 'divider',
            my: 1.5,
          },
        },
      }}
    >
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </Box>
  )
}

function Toolbar({ editor, disabled }: { editor: Editor | null; disabled: boolean }) {
  if (!editor) {
    return (
      <Box
        sx={{
          height: 40,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      />
    )
  }

  function setLink() {
    const previous = editor!.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.25,
        px: 0.5,
        py: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <ToolBtn
        title="Bold"
        active={editor.isActive('bold')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Italic"
        active={editor.isActive('italic')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Underline"
        active={editor.isActive('underline')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FormatUnderlinedIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Strikethrough"
        active={editor.isActive('strike')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughSIcon fontSize="small" />
      </ToolBtn>

      <ToolDivider />

      <ToolBtn
        title="Heading 1"
        active={editor.isActive('heading', { level: 1 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Box component="span" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>H1</Box>
      </ToolBtn>
      <ToolBtn
        title="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Box component="span" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>H2</Box>
      </ToolBtn>
      <ToolBtn
        title="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Box component="span" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>H3</Box>
      </ToolBtn>

      <ToolDivider />

      <ToolBtn
        title="Bullet list"
        active={editor.isActive('bulletList')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Numbered list"
        active={editor.isActive('orderedList')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Quote"
        active={editor.isActive('blockquote')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FormatQuoteIcon fontSize="small" />
      </ToolBtn>

      <ToolDivider />

      <ToolBtn
        title="Inline code"
        active={editor.isActive('code')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Code block"
        active={editor.isActive('codeBlock')}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <DataObjectIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Horizontal rule"
        disabled={disabled}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <HorizontalRuleIcon fontSize="small" />
      </ToolBtn>

      <ToolDivider />

      <ToolBtn
        title="Add link"
        active={editor.isActive('link')}
        disabled={disabled}
        onClick={setLink}
      >
        <LinkIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Remove link"
        disabled={disabled || !editor.isActive('link')}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <LinkOffIcon fontSize="small" />
      </ToolBtn>

      <Box sx={{ flex: 1 }} />

      <ToolBtn
        title="Undo"
        disabled={disabled || !editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <UndoIcon fontSize="small" />
      </ToolBtn>
      <ToolBtn
        title="Redo"
        disabled={disabled || !editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <RedoIcon fontSize="small" />
      </ToolBtn>
    </Box>
  )
}

function ToolBtn({
  title,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  title: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          aria-label={title}
          aria-pressed={active}
          sx={{
            width: 30,
            height: 30,
            borderRadius: 0.75,
            color: active ? 'primary.main' : 'text.secondary',
            bgcolor: active ? 'action.selected' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  )
}

function ToolDivider() {
  return <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />
}

export function isHtmlEmpty(html: string): boolean {
  if (!html) return true
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length === 0
}
