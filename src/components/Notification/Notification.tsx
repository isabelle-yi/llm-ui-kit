import type { ReactNode } from 'react'
import './Notification.less'

export type NotificationType = 'success' | 'error' | 'loading'

export interface NotificationItem {
    id: number
    type: NotificationType
    content: ReactNode
    duration?: number
}

function getIcon(type: NotificationType): string {
    switch (type) {
        case 'success': return '✓'
        case 'error': return '✗'
        case 'loading': return '⏳'
    }
}

export interface NotificationItemProps {
    item: NotificationItem
    onClose: (id: number) => void
}

export function NotificationItem({ item, onClose }: NotificationItemProps) {
    return (
        <div className={`notification-item ${item.type}`}>
            <span className="notification-icon">{getIcon(item.type)}</span>
            <span className="notification-content">{item.content}</span>
            <button className="notification-close" onClick={() => onClose(item.id)}>×</button>
        </div>
    )
}
