import type { ReactNode, MouseEvent } from 'react'
import './Actions.less'

export interface ActionItem {
    key: string
    label: string
    icon?: ReactNode
    onClick: () => void
}

export interface ActionsProps {
    items: ActionItem[]
    showCopy?: boolean
    showRegenerate?: boolean
    onCopy?: () => void
    onRegenerate?: () => void
}

export function Actions ({
    items = [],
    showCopy = true,
    showRegenerate = true,
    onCopy,
    onRegenerate
} : ActionsProps) {
    function handleClick (e: MouseEvent, callback: () => void) {
        e.stopPropagation()
        e.preventDefault()
        callback()
    }
    
    const builtInActions: ActionItem[] = []

    if (showCopy) {
        builtInActions.push({
            key: 'copy',
            label: '复制',
            icon: <span className="actions-icon">📋</span>,
            onClick: () => onCopy?.()
        })
    }

    if (showRegenerate) {
        builtInActions.push({
            key: 'regenerate',
            label: '重新生成',
            icon: <span className="actions-icon">🔄</span>,
            onClick: () => onRegenerate?.()
        })
    }

    const allActions = items.length > 0 ? items : builtInActions

    return (
        <div className="actions">
          {allActions.map((action) => (
            <button
               key={action.key}
               className="actions-item"
               onClick={(e) => handleClick(e, action.onClick)}
            >
                {action.icon}
                <span className="actions-label">{action.label}</span>
            </button>
          ))}
        </div>
    )
    
}