import { useState, useRef, useEffect } from 'react'
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
      { key: 'p3', title: '把这段话翻译成英文', icon: '🌐' },
      { key: 'p4', title: '解释什么是量子计算', icon: '🔬' },
      { key: 'p5', title: '写一份周报总结', icon: '📋' },
      { key: 'p6', title: '优化这段代码的性能', icon: '⚡' },
      { key: 'p7', title: '帮我润色这段文案', icon: '✨' },
      { key: 'p8', title: '推荐几本前端开发书籍', icon: '📚' },
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
    const [activeId, setActiveId] = useState<string>('')

    const [messages, setMessages] = useState<ChatMessageData[]>([])
    const [streaming, setStreaming] = useState(false)
    const [switching, setSwitching] = useState(false)
    const chatMessagesRef = useRef<HTMLDivElement>(null)

    const [inputValue, setInputValue] = useState('')

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const pendingMessageRef = useRef<string | null>(null)

    useEffect(() => {
      setMessages([]);
        if (activeId) {
          const msgs = loadMessages(activeId);
          setMessages(msgs);
        }
    }, [activeId]);

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

    useEffect(() => {
        const el = chatMessagesRef.current;
        if (el && streaming) {
           el.scrollTop = el.scrollHeight;
        }
    }, [messages, streaming]);

    function handleNewChat() {
        const newId = genId();
        const newConv: ConversationData = {
            id: newId,
            title: '新会话',
            lastMessage: '',
            lastTime: Date.now(),
            isPinned: false,
            isFavorited: false
        }

        setMessages([]);
        setInputValue('')
        setConversations(prev => {
            const updated = [newConv, ...prev]
            saveConversations(updated) 
            return updated
        })
        setActiveId(newId)
    }

    function handleDeleteConv(id: string) {
        setConversations(prev => prev.filter(c => c.id !== id))
        localStorage.removeItem(`demo-messages-${id}`)
        if (activeId === id) {
            setActiveId('')
            setMessages([]);
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
            <Sidebar>
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
                <div className="chat-top-nav">
                    <div className="nav-left">
                       <h2>AI 对话</h2>
                    </div>
                    <div className="nav-right">
                        <button onClick={handleNewChat} style={{ padding: '8px 12px' }}>+ 新建</button>
                    </div>
                </div>

               <div className="chat-content-wrapper">
                <div className={`chat-messages ${switching ? 'switching' : ''}`}  key={activeId} ref={chatMessagesRef}>
                    <div className="messages-inner">
                    {messages.length === 0 && (
                        <div className="chat-empty">
                            <h2>👋 欢迎使用AI对话助手</h2>
                            <div className="chat-empty-prompts">
                                <Prompts
                                   groups={promptsConfig}
                                   onSelect={handlePropmptSelect}
                                />
                            </div>
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
                                avatar={undefined}
                                timestamp={msg.role === 'user' ? msg.timestamp : undefined}
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
                  </div>
                </div>

                <div className="chat-input-area">
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