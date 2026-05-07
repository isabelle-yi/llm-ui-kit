import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeHighlighter } from '../CodeHighlighter'
import './Mark.less'

export interface MarkProps {
    content: string
    maxRows?: number
    streaming?: boolean
}

function sanitizeChunk(text: string): string {
    let result = text
    const fenceCount = (result.match(/```/g) || []).length
    if (fenceCount % 2 !== 0) {
        result += '\n```'
    }
    return result
}

export function Mark({ content, maxRows = 15, streaming = false }: MarkProps) {
    const [expanded, setExpanded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const safeContent = streaming ? sanitizeChunk(content) : content
    const lineCount = content.split('\n').length
    const shouldFold = !streaming && lineCount > maxRows && !expanded

    const displayContent = shouldFold
    ? content.split('\n').slice(0, maxRows).join('\n') + '\n\n...'
    : safeContent
    
    useEffect(() => {
        if (streaming && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [content, streaming])
    return (
        <div className="mark-container" ref={containerRef}>
            <div 
             className={`mark-body ${shouldFold ? 'mark-folder' : ''}`}
             style={shouldFold ? { maxHeight: maxRows * 24 } : undefined}
            >
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
                                code={String(children)}
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
                {streaming && <span className="mark-cursor">▍</span>}
            </div>
            {!streaming && lineCount > maxRows && (
                <button className="mark-toggle" onClick={() => setExpanded(!expanded)}>
                    {expanded ? '收起' : '展开全部'}
                </button>
            )}
        </div>
    )
}