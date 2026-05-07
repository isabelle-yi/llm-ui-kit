import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './CodeHighlighter.less'

export interface CodeHighlighterProps {
    code: string
    language?: string
    maxLines?: number
    showLanguage?: boolean
    showCopy?: boolean
}

export function CodeHighlighter ({
    code,
    language = 'text',
    maxLines = 15,
    showLanguage = true,
    showCopy = true
}: CodeHighlighterProps) {
    const [copied, setCopied] = useState(false)
    const [expanded, setExpanded] = useState(false)

    const cleanCode = code.replace(/\n$/, '')
    const lineCount = cleanCode.split('\n').length
    const overLimit = lineCount > maxLines
    const shouldFold = overLimit && !expanded

    const displayCode = shouldFold
    ? cleanCode.split('\n').slice(0, maxLines).join('\n') + '\n// ...更多代码已折叠'
    : cleanCode

    function handleCopy() {
        navigator.clipboard.writeText(cleanCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
  }
  
    return (
        <div className="code-highlighter">
           <div className="code-highlighter-header">
               <span className="code-highlighter-lang">{showLanguage ? language : ''}</span>
               <div className="code-highlighter-actions">
                    {showCopy && (
                        <button className="code-highlighter-btn" onClick={handleCopy}>
                          {copied ? '✓ 已复制' : '📋 复制'}
                        </button>
                    )}
               </div>
           </div>
           <SyntaxHighlighter
              style={oneLight}
              language={language}
              PreTag="div"
              showLineNumbers={lineCount > 3}
           >
              {displayCode}
           </SyntaxHighlighter>
           {overLimit && (
             <button className="code-highlighter-toggle" onClick={() => setExpanded(!expanded)}>
               {expanded ? '收起代码' : '展开全部代码'}
             </button>
           )}
        </div>
    ) 
}