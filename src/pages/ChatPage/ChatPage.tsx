import { useState, useRef, useCallback, useEffect } from 'react'
import { Conversation, Sidebar, type ConversationData } from '../../components/Conversation'
import { Bubble } from '../../components/Bubble'
import { Sender } from '../../components/Sender'
import { Mark } from '../../components/Mark'
import { Think } from '../../components/Think'
import { Prompts, type PromptItem } from '../../components/Prompts'
import { Actions } from '../../components/Actions'
import { notify } from '../../components/Notification'
import { chatStream, type ChatMessage } from '../../services/api'
import './ChatPage.less'

export interface ChatMessageData {
    id: string
    role: 'user' | 'assistant'
    content: string
    status: 'sending' | 'streaming' | 'done' | 'error'
    timestamp: number
    thinkContent?: string
}

const promptsConfig = [
    {
        label: '',
        items: [
            { key: 'p1', title: '帮我写一份辞职信', icon: '✉️' },
            { key: 'p2', title: '用 TypeScript 写排序算法', icon: '💻' },
            { key: 'p3', title: '把这段话翻译成英文', icon: '🌐' }
        ]
    }
]

function genId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadConversations(): ConversationData[] {
    try {
        const raw = localStorage.getItem('demo-conversations')
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveConversations(data: ConversationData[]) {
    localStorage.setItem('demo-conversations', JSON.stringify(data))
}

function loadMessages(convId: string): ChatMessageData[] {
    try {
        const raw = localStorage.getItem(`demo-messages-${convId}`)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveMessages(convId: string, msgs: ChatMessageData[]) {
    localStorage.setItem(`demo-messages-${convId}`, JSON.stringify(msgs))
}

export function ChatPage() {
    const [conversations, setConversations] = useState<ConversationData[]>(loadConversations)
    const [activeId, setActiveId] = useState<string>(conversations[0]?.id || '')
    const activeConv = conversations.find(c => c.id === activeId)

    const [messages, setMessages] = useState<ChatMessageData[]>([])
    const [streaming, setStreaming] = useState(false)

    const [inputValue, setInputValue] = useState('')

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const pendingMessageRef = useRef<string | null>(null)

    useEffect(() => {
        if (activeId) {
            setMessages(loadMessages(activeId))
        } else {
            setMessages([])
        }
    }, [activeId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        saveConversations(conversations)
    }, [conversations])

    useEffect(() => {
        if (activeId && messages.length > 0) {
            saveMessages(activeId, messages)
        }
    }, [messages, activeId])

    useEffect(() => {
        if (activeId && pendingMessageRef.current) {
            const text = pendingMessageRef.current
            pendingMessageRef.current = null
            sendRealMessage(text)
        }
    }, [activeId])

    function handleNewChat() {
        const newConv: ConversationData = {
            id: genId(),
            title: '新会话',
            lastMessage: '',
            lastTime: Date.now(),
            isPinned: false,
            isFavorited: false
        }
        setConversations(prev => [newConv, ...prev])
        setActiveId(newConv.id)
        setInputValue('')
    }

    function handleDeleteConv(id: string) {
        setConversations(prev => prev.filter(c => c.id !== id))
        localStorage.removeItem(`demo-messages-${id}`)
        if (activeId === id) {
            const remaining = conversations.filter(c => c.id !== id)
            setActiveId(remaining[0]?.id || '')
        }
    }

    function handleTogglePin(id: string) {
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
        )
    }

    function handleToggleFavorite(id: string) {
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, isFavorited: !c.isFavorited } : c))
        )
    }

    function updateConvTitle(id: string, title: string) {
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, title } : c))
        )
    }

    function updateConvPreview(id: string, preview: string, time: number) {
        setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, lastMessage: preview.slice(0, 30), lastTime: time } : c))
        )
    }

    function handleSend(text: string) {
        if (!activeId) {
            pendingMessageRef.current = text
            handleNewChat()
            return
        }
        sendRealMessage(text)
    }

    function sendRealMessage(text: string) {
        setInputValue('')

        const userMsg: ChatMessageData = {
            id: genId(),
            role: 'user',
            content: text,
            status: 'done',
            timestamp: Date.now()
        }

        if (messages.length === 0) {
            updateConvTitle(activeId, text.slice(0, 20))
        }

        const aiMsg: ChatMessageData = {
            id: genId(),
            role: 'assistant',
            content: '',
            status: 'streaming',
            timestamp: Date.now()
        }

        const newMessages = [...messages, userMsg, aiMsg]
        setMessages(newMessages)
        setStreaming(true)

        const history: ChatMessage[] = newMessages
            .filter(m => m.content || m.status === 'streaming')
            .map(m => ({
                role: m.role,
                content: m.role === 'assistant' && m.status === 'streaming' ? '' : m.content
            }))

        if (history.length > 0 && history[history.length - 1].role === 'assistant') {
            history.pop()
        }

        chatStream(
            history,
            (chunk) => {
                if (chunk.type === 'reasoning') {
                    setMessages(prev => prev.map(msg => 
                        msg.role === 'assistant' && msg.status === 'streaming'
                            ? { ...msg, thinkContent: (msg.thinkContent || '') + chunk.text }
                            : msg
                    ))
                } else {
                    setMessages(prev => prev.map(msg => 
                        msg.role === 'assistant' && msg.status === 'streaming'
                            ? { ...msg, content: msg.content + chunk.text }
                            : msg
                    ))
                }
            },
            () => {
              setStreaming(false);
              setMessages((prev: ChatMessageData[]) => {
                const updated = prev.map(msg => {
                  if (msg.role === 'assistant' && msg.status === 'streaming') {
                    return {
                      ...msg,
                      status: 'done' as const, 
                      timestamp: Date.now()
                    };
                  }
                 return msg;
            });

                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updateConvPreview(activeId, last.content, Date.now());
                }

                return updated;
             });
            },
            (err) => {
                setStreaming(false)
                setMessages(prev => prev.map(msg => 
                    msg.role === 'assistant' && msg.status === 'streaming'
                        ? { ...msg, status: 'error', content: `❌ 错误：${err.message}` }
                        : msg
                ))
                const msg = err.message
                if (msg.includes('401') || msg.includes('403') || msg.includes('API Key')) {
                    notify.error('API Key 无效或过期')
                } else if (msg.includes('429') || msg.includes('频繁')) {
                    notify.error('请求过于频繁，请稍后重试')
                } else if (msg.includes('5') && msg.length < 10) {
                    notify.error('服务端错误，请稍后重试')
                } else if (msg.includes('超时') || msg.includes('timeout')) {
                    notify.error('请求超时，请稍后重试')
                } else {
                    notify.error('网络连接失败，请检查网络')
                }
            }
        )
    }

    function handleCopy(text: string) {
        navigator.clipboard.writeText(text)
        notify.success('已复制到剪切板')
    }

    function handleRegenerate() {
        const updated = [...messages]
        updated.pop()
        const lastUser = updated.filter(m => m.role === 'user').pop()
        if (lastUser) {
            setMessages(updated)
            handleSend(lastUser.content)
        }
    }

    function handlePropmptSelect(item: PromptItem) {
        setInputValue(item.title)
    }

    return (
        <div className="chat-page">
            <Sidebar title="AI 对话" onNewChat={handleNewChat}>
                <Conversation
                    conversations={conversations}
                    activeId={activeId}
                    onSelect={setActiveId}
                    onDelete={handleDeleteConv}
                    onTogglePin={handleTogglePin}
                    onToggleFavorite={handleToggleFavorite}
                    onRename={(id, title) => updateConvTitle(id, title)}
                />
            </Sidebar>

            <div className="chat-main">
                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="chat-empty">
                            <h2>👋 欢迎使用AI对话助手</h2>
                            <p>选择下方提示词开始对话，或直接输入你的问题</p>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div key={msg.id}>
                            {msg.role === 'assistant' && msg.thinkContent && (
                                <Think
                                    status={msg.status === 'streaming' ? 'thinking' : 'done'}
                                    defaultExpanded={false}
                                >
                                    {msg.thinkContent}
                                </Think>
                            )}
                            <Bubble
                                position={msg.role === 'user' ? 'right' : 'left'}
                                avatar={msg.role === 'user' ? '😊' : '🤖'}
                                timestamp={msg.timestamp}
                                status={msg.role === 'assistant' ? (msg.status === 'streaming' ? 'sending' : msg.status === 'error' ? 'failed' : 'sent') : 'sent'}
                            >
                                {msg.content ? (
                                    <Mark content={msg.content} streaming={msg.status === 'streaming'} />
                                ) : msg.status === 'streaming' ? (
                                    <Mark content="" streaming />
                                ) : null}
                            </Bubble>

                            {msg.role === 'assistant' && msg.status === 'done' && (
                                <div className="chat-actions-row">
                                    <Actions
                                        onCopy={() => handleCopy(msg.content)}
                                        onRegenerate={handleRegenerate}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <Prompts
                        groups={promptsConfig}
                        onSelect={handlePropmptSelect}
                    />
                    <Sender
                        value={inputValue}
                        onChange={setInputValue}
                        placeholder="输入你的问题，Enter发送，Shift+Enter 换行"
                        loading={streaming}
                        disabled={streaming}
                        onSend={handleSend}
                    />
                </div>
            </div>
        </div>
    )
}