import type { ReactNode } from 'react'
import './Bubble.less'

export type MessageStatus = 'sending' | 'sent' |'failed'

export interface BubbleProps {
    position : 'left' | 'right'
    avatar?: ReactNode
    timestamp?: number
    status?: MessageStatus
    children: ReactNode 
}

function formationTime(ts: number): string {
    const date = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if(minutes < 1) return '刚刚'
    if(minutes < 60) return `${minutes}分钟前`
    if(hours < 24) return `${hours}小时前`

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hour}:${minute}`
}

export function Bubble({
    position,
    avatar,
    timestamp,
    status = 'sent',
    children
}: BubbleProps) {
    return (
        <div className={`bubble-wrapper bubble-${position}`}>
            {avatar && <div className="bubble-avatar">{avatar}</div>}
            <div className="bubble-content">
                <div className="bubble-body">{children}</div>
                <div className="bubble-footer">
                    {timestamp && <span className="bubble-time">{formationTime(timestamp)}</span>}
                    {status === 'sending' && <span className="bubble-status sending">发送中...</span>}
                    {status === 'failed' && <span className="bubble-status failed">发送失败</span>}
                </div>
            </div>
        </div>
    )
}