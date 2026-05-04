import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Mark.less'

export interface MarkProps {
    content: string
    maxRows?: number
}

function CodeBlock({ language, children }: { language: string; children: string })
{
    const [copied,setCopied] = useState(false)
    const code = String(children).replace(/\n$/, '')

    function handleCopy() {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    
    return (
        <div className="mark-code-block">
            <div className="mark-code-header">
                <span className="mark-code-lang">{language || 'text'}</span>
                <button className="mark-code-copy" onClick={handleCopy}>
                    {copied ? '已复制' : '复制'}
                </button>
            </div>
            <SyntaxHighlighter
              style={oneLight}
              language={language || 'text'}
              PreTag="div"
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}

export function Mark({ content, maxRows = 15 }: MarkProps) {
    const [expanded, setExpanded] = useState(false)
    const lineCount = content.split('\n').length
    const shouldFold = lineCount > maxRows && !expanded

    const displayContent = shouldFold
    ? content.split('\n').slice(0, maxRows).join('\n') + '\n\n...'
    : content

    return (
        <div className="mark-container">
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
                                <CodeBlock language={match?.[1] || ''}>
                                    {String(children)}
                                </CodeBlock>
                            )
                        }
                    }}
                >
                    {displayContent}
                </ReactMarkdown>
            </div>
            {lineCount > maxRows && (
                <button className="mark-toggle" onClick={() => setExpanded(!expanded)}>
                    {expanded ? '收起' : '展开全部'}
                </button>
            )}
        </div>
    )
}