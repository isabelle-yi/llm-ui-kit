import type { Meta, StoryObj } from '@storybook/react'
import { Conversation, type ConversationData } from './Conversation'
import { useState } from 'react'

const meta: Meta<typeof Conversation> = {
    title: 'Components/Conversation',
    component: Conversation,
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Conversation>

const initialConversations: ConversationData[] = [
    {
        id: '1',
        title: 'React 组件设计',
        lastMessage: '可以把组件拆分成更小的单元...',
        lastTime: Date.now() - 60000,
        isPinned: true,
        isFavorited: false
    },
   {
    id: '2',
    title: 'TypeScript 类型问题',
    lastMessage: '用泛型可以解决这个类型推断...',
    lastTime: Date.now() - 3600000,
    isPinned: false,
    isFavorited: true
  },
  {
    id: '3',
    title: 'API 接口设计讨论',
    lastMessage: 'RESTful 风格更合适这个场景...',
    lastTime: Date.now() - 7200000,
    isPinned: false,
    isFavorited: false
  },
  {
    id: '4',
    title: '代码审查反馈',
    lastMessage: '建议这里用 useMemo 优化性能',
    lastTime: Date.now() - 86400000,
    isPinned: true,
    isFavorited: false
  },
  {
    id: '5',
    title: '部署配置',
    lastMessage: '先用测试环境验证再上生产',
    lastTime: Date.now() - 259200000,
    isPinned: false,
    isFavorited: false
  }
]

function FullDemo() {
    const [conversations, setConversations] = useState<ConversationData[]>(initialConversations)
    const [activeId, setActiveId] = useState('1');

    function handleDelete(id: string) {
        setConversations(prev => prev.filter(c => c.id !== id))
        if (activeId === id && conversations.length > 1) {
            setActiveId(conversations[0].id === id ? conversations[1].id : conversations[0].id)
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

    function handleRename(id: string, newTitle: string) {
        setConversations(prev => 
            prev.map(c => (c.id === id ? { ...c, title: newTitle } : c ))
        )
    }

    return (
        <div style={{ maxWidth: 340, background: '#fff'}}>
            <Conversation
               conversations={conversations}
               activeId={activeId}
               onSelect={setActiveId}
               onDelete={handleDelete}
               onTogglePin={handleTogglePin}
               onToggleFavorite={handleToggleFavorite}
               onRename={handleRename}
            />
        </div>
    )
}

export const Default: Story = {
    args: {
        conversations: initialConversations,
        activeId: '1'
    }
}

export const FullInteractive: Story = {
    render: () => <FullDemo/>
}

export const Empty: Story = {
    args: {
        conversations: [],
        activeId: undefined
    }
}