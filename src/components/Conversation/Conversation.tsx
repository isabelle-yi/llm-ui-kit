import './Conversation.less'

export interface ConversationData {
    id: string
    title: string
    lastMessage: string
    lastTime: number
    isPinned: boolean
    isFavorited: boolean
}

export interface ConversationItemProps {
    conversation: ConversationData
    isActive: boolean
    onClick: (id: string) => void
}

function formatConvTime(ts: number): string {
    const now = Date.now()
    const diff = now - ts
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const date = new Date(ts)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (hours < 168) return `${Math.floor(hours / 24)}天前`

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}-${day}`
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
    const { id, title, lastMessage, isPinned } = conversation
    return (
    <div
      className={`conversation-item ${isActive ? 'active' : ''} ${isPinned ? 'pinned' : ''}`}
      onClick={() => onClick(id)}
    >
      <div className="conversation-item-top">
        <span className="conversation-item-title">
          {isPinned && '📌 '}
          {title}
        </span>
        <span className="conversation-item-time">
          {formatConvTime(conversation.lastTime)}
        </span>
      </div>
      <div className="conversation-item-preview">{lastMessage}</div>
    </div>
  )
}

export interface ConversationProps {
    conversations: ConversationData[]
    activeId?: string
    onSelect?: (id: string) => void
}

export function Conversation({ conversations, activeId, onSelect }: ConversationProps) {
    const sorted = [...conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.lastTime - a.lastTime
    }) 

    return (
      <div className="conversation">
        {sorted.map(conv => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
            onClick={(id) => onSelect?.(id)}
          />
        ))}
      </div>
    )
}
