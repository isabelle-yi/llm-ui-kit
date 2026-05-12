import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import './Conversation.less'

export interface ConversationData {
    id: string
    title: string
    lastMessage: string
    lastTime: number
    isPinned: boolean
    isFavorited: boolean
}

export interface ConversationCallbacks {
    onRename?: (id: string, newTitle: string ) => void
    onDelete?: (id: string) => void
    onTogglePin?: (id: string) => void
    onToggleFavorite?: (id: string) => void
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

export interface ConversationItemProps {
    conversation: ConversationData
    isActive: boolean
    onClick: (id: string) => void
    onRename?: (id: string, newTitle: string) => void
    onDelete?: (id: string) => void
    onTogglePin?: (id: string) => void
    onToggleFavorite?: (id: string) => void
}

export function ConversationItem({ 
    conversation, 
    isActive, 
    onClick,
    onRename,
    onDelete,
    onTogglePin,
    onToggleFavorite 
  }: ConversationItemProps) {
    const { id, title, lastMessage, isPinned, isFavorited } = conversation
    
    const [menuOpen, setMenuOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(title)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [editing])

    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setMenuOpen(false)
        }
      }
      if (menuOpen) {
        document.addEventListener('mousedown', handleClick)
      }
      return () => document.removeEventListener('mousedown', handleClick)
    }, [menuOpen])

    function handleRenameSubmit() {
      const trimmed = editTitle.trim()
      if (trimmed && trimmed !==title){
        onRename?.(id, trimmed)
      }
      setEditing(false)
    }

    function handleRenameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter') handleRenameSubmit()
      if (e.key === 'Escape') {
        setEditTitle(title)
        setEditing(false)
      }
    }
    
    function handleDelete() {
      setShowDeleteConfirm(false)
      setMenuOpen(false)
      onDelete?.(id)
    }

    return (
    <>
    <div
      className={`conversation-item ${isActive ? 'active' : ''} ${isPinned ? 'pinned' : ''}`}
      onClick={() => onClick(id)} 
      onContextMenu={(e) => {
        e.preventDefault()
        setMenuOpen(true)
      }}
    >
      <div className="conversation-item-top">
        {editing ? (
          <input
            ref={inputRef}
            className="conversation-rename-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleRenameKeyDown}
            onClick={(e) => e.stopPropagation}
            onDoubleClick={(e) => e.stopPropagation()}
          />
        ) : (
        <span className="conversation-item-title"
           onDoubleClick={(e) => {
           e.stopPropagation()
           setEditing(true)
        }}
        >
          {isPinned && '📌 '}
          {isFavorited && '⭐ '}
          {title}
        </span>
        )}
        <span className="conversation-item-time">
          {formatConvTime(conversation.lastTime)}
        </span>
      </div>
      <div className="conversation-item-preview">{lastMessage}</div>
      
      <div className="conversation-item-actions">
        <button
          className="action-btn"
          title={isPinned ? '取消置顶' : '置顶'}
          onClick={(e) => {
            e.stopPropagation()
            onTogglePin?.(id)
          }}
        >
          📌
        </button>
        <button
          className="action-btn"
          title={isFavorited ? '取消收藏' : '收藏'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(id)
          }}
        >
          {isFavorited ? '⭐ ' : '☆'}
        </button>
        <button
          className="action-btn"
          title="删除"
          onClick={(e) => {
            e.stopPropagation()
            setShowDeleteConfirm(true)
          }}
        >
          🗑️
        </button>
      </div>
    </div>

    {showDeleteConfirm && (
      <div className="conv-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
        <div className="conv-modal" onClick={(e) => e.stopPropagation()}>
          <p>确认要删除「{title}」吗？</p>
          <div className="conv-modal-buttons">
            <button onClick={() => setShowDeleteConfirm(false)}>取消</button>
            <button className="danger" onClick={handleDelete}>删除</button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export interface ConversationProps {
    conversations: ConversationData[]
    activeId?: string
    onSelect?: (id: string) => void
    onRename?: (id: string, newTitle: string) => void
    onDelete?: (id: string) => void
    onTogglePin?: (id: string) => void
    onToggleFavorite?: (id: string) => void
}

export function Conversation({ 
  conversations, 
  activeId, 
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
  onToggleFavorite 
}: ConversationProps) {
    const sorted = [...conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.lastTime - a.lastTime
    }) 

    return (
      <div className="conversation">
        {sorted.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeId}
            onClick={(id) => onSelect?.(id)}
            onRename={onRename}
            onDelete={onDelete}
            onTogglePin={onTogglePin}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    )
}
