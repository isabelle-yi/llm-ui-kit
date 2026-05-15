import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeHighlighter } from '../CodeHighlighter'
import './Mark.less'

export interface MarkProps {
    content: string
    streaming?: boolean
}

function sanitizeChunk(text: string): string {
    let result = text
    result = result.replace(/\r/g, '')
    result = result.replace(/^#\s+/gm, '`#` ')
    const fenceCount = (result.match(/```/g) || []).length
    if (fenceCount % 2 !== 0) {
        result += '\n```'
    }
    return result
}

function cleanMarkdown(text: string): string {
  let result = text

  result = result.replace(/(#{1,6})\s*(.+?)\s*\1/g, '$1 $2')

  result = result.replace(/^( {4,}|\t+)(?=\S)/gm, '')

  return result
}

export function Mark({ content, streaming = false }: MarkProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    
    let displayContent = ''
    if (streaming) {
        displayContent = sanitizeChunk(content)
    } else {
        displayContent = cleanMarkdown(content)
    }

    useEffect(() => {
        if (streaming && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [content, streaming])

    return (
        <div className="mark-container" ref={containerRef}>
            <div className="mark-body">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            const isInline = !match && !String(children).includes('\n')

                            if (isInline) {
                                return <code className="mark-inline-code" {...props}>{children}</code>
                            }

                            return (
                               <CodeHighlighter
                                code={String(children).replace(/\n$/, '')}
                                language={match?.[1] || 'text'}
                                maxLines={20}
                               />
                            )
                        },
                        img({ src, alt }) {
                            return <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8 }} />
                        }
                    }}
                >
                    {displayContent}
                </ReactMarkdown>
            </div>
        </div>
    )
}