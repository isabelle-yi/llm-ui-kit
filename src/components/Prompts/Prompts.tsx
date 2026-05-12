import type { ReactNode } from 'react'
import './Prompts.less'

export interface PromptItem {
    key: string
    title: string
    description?: string
    icon?: ReactNode
}

export interface PromptGroup {
  label: string
  items: PromptItem[]
}

export interface PromptsProps {
    groups?: PromptGroup[]
    items?: PromptItem[]
    onSelect?: (item: PromptItem) => void
    title?: string
}

export function Prompts({ groups, items, onSelect, title }: PromptsProps) {
    const allGroups: PromptGroup[] = groups || (items ? [{ label: title || '', items }] : [])
    return (
         <div className="prompts">
      {allGroups.map((group, gi) => (
        <div key={gi} className="prompts-group">
          {group.label && <div className="prompts-group-label">{group.label}</div>}
          <div className="prompts-list">
            {group.items.map(item => (
              <div
                key={item.key}
                className="prompts-item"
                onClick={() => onSelect?.(item)}
              >
                {item.icon && <span className="prompts-item-icon">{item.icon}</span>}
                <div className="prompts-item-content">
                  <div className="prompts-item-title">{item.title}</div>
                  {item.description && (
                    <div className="prompts-item-desc">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}