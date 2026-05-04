import { useState, useRef, useCallback, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationItem, type NotificationType, type NotificationItem as NItem } from './Notification'

function NotificationContainer() {
    const [items, setItems] = useState<NItem[]>([])
    const counterRef = useRef(0)
    const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

    const add = useCallback((type: NotificationType, content: ReactNode, duration = 3000) => {
        const id = ++counterRef.current
        setItems(prev => [...prev, { id, type, content, duration }])

        if (duration > 0) {
            const timer = setTimeout(() => remove(id), duration)
            timersRef.current.set(id, timer)
        }

        return id
    },[])

    const remove = useCallback((id: number) => {
        const timer = timersRef.current.get(id)
        if(timer) {
            clearTimeout(timer)
            timersRef.current.delete(id)
        } 
        setItems(prev => prev.filter(item => item.id !== id))
    },[])

    ;(NotificationContainer as any).add = add
    ;(NotificationContainer as any).remove = remove

    return  (
        <div className="notification-container">
            {items.map(item => (
                <NotificationItem key={item.id} item={item} onClose={remove} />
            ))}
        </div>
    )
}

let container: HTMLDivElement | null =null

function ensureContainer() {
    if (container) return
    container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    root.render(<NotificationContainer />)
}

export function notify(type: NotificationType, content: ReactNode, duration?: number): number {
    ensureContainer()
    const add = (NotificationContainer as any).add as (type: NotificationType, content: ReactNode, duration?: number) => number
    return add(type, content, duration)
}

notify.success = (content: ReactNode, duration?: number) => notify('success', content, duration)
notify.error = (content: ReactNode,duration?: number) => notify('error', content, duration)
notify.loading = (content:ReactNode, duration?: number) => notify('loading', content, duration)
