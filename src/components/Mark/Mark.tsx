import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeHighlighter } from '../CodeHighlighter'
import './Mark.less'

export interface MarkProps {
    content: string
    streaming?: boolean
}

// 流式时：只补全代码块，绝对不修改文本结构（保证流畅）
function sanitizeChunk(text: string): string {
    let result = text
    result = result.replace(/\r/g, '')
    
    // 补全未闭合的代码块
    const fenceCount = (result.match(/```/g) || []).length
    if (fenceCount % 2 !== 0) {
        result += '\n```'
    }
    return result
}

// 结束后：把 # 标题 → 加粗文本（你要的效果）
function cleanMarkdown(text: string): string {
    let result = text
    result = result.replace(/^(#{1,6})\s+(.+)$/gm, '**$2**') // 去掉#标题
    result = result.replace(/^( {4,}|\t+)(?=\S)/gm, '')
    return result
}

export function Mark({ content, streaming = false }: MarkProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // 直接渲染最新内容，不加任何定时器！！！
    const displayContent = streaming 
        ? sanitizeChunk(content) 
        : cleanMarkdown(content)

    // 流畅自动滚动（不跳、不抖）
    useEffect(() => {
        const el = containerRef.current
        if (el && streaming) {
            el.scrollTop = el.scrollHeight
        }
    }, [displayContent])

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