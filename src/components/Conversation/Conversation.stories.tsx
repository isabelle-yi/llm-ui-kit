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

const mockConversations: ConversationData[] = [
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

export const Default: Story = {
    args: {
        conversations: mockConversations,
        activeId: '1'
    }
}

function InteractiveDemo() {
    const [activeId, setActiveId] = useState('1')
    return (
        <div style={{ maxWidth: 320,background: '#fff'}}>
          <Conversation
            conversations={mockConversations}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
    )
}

export const Interactive: Story = {
    render: () => <InteractiveDemo/>
}

export const Empty: Story = {
    args: {
        conversations: [],
        activeId: undefined
    }
}