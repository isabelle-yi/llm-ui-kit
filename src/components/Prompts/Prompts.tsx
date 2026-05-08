import type { ReactNode } from 'react'
import './Prompts.less'

export interface PromptItem {
    key: string
    title: string
    description?: string
    icon?: ReactNode
}

export interface PromptsProps {
    items: PromptItem[]
    onSelect?: (item: PromptItem) => void
    title?: string
}

export function Prompts({ items, onSelect, title }: PromptsProps) {
    return (
        <div className="prompts">
          {title && <div className="prompts-title">{title}</div>}
          <div className="prompts-list">
            {items.map(item => (
                <div
                   key={item.key}
                   className="prompts-item"
                   onClick={() => onSelect?.(item)}
                >
                  {item.icon && <span className="prompts-item-icon">{item.icon}</span>}
                  <div className="prompts-item-content">
                     <div className="prompts-items-title">{item.title}</div>
                     {item.description && (
                        <div className="prompts-item-desc">{item.description}</div>
                     )}
                  </div>
                </div>
            ))}
          </div>
        </div>
    )
}