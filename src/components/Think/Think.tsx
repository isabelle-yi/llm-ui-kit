import { useState, type ReactNode } from 'react'
import './Think.less'

export type ThinkStatus = 'thinking' | 'done'

export interface ThinkProps {
    children?: ReactNode
    status?: ThinkStatus
    thinkingText?: string
    doneText?: string
    defaultExpanded?: boolean
}

export function Think({
    children,
    status = 'thinking',
    thinkingText = '正在思考...',
    doneText = '思考完成',
    defaultExpanded = false
}: ThinkProps) {
    const [expanded, setExpanded] = useState(defaultExpanded)
    const isThinking = status === 'thinking'

    return (
        <div className={`think ${isThinking ? 'think-thinking' : 'think-done'}`}>
           <div className="think-header" onClick={() => setExpanded(!expanded)}>
               <span className="think-icon">
                  {isThinking ? <span className="think-spinner" /> : '✓'}
               </span>
               <span className="think-status-text">
                  {isThinking ? thinkingText : doneText}
               </span>
               <span className={`think-arrow ${expanded ? 'expanded' : ''}`}>▼</span>
           </div>
            {expanded && children && <div className="think-body">{children}</div>}
        </div>
    )
}