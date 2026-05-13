import type { Meta, StoryObj } from '@storybook/react'
import { Actions, type ActionItem } from './Actions'

const meta: Meta<typeof Actions> = {
    title: 'Components/Actions',
    component: Actions,
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Actions>

export const Default: Story = {
    args: {
        onCopy: () => alert('已复制'),
        onRegenerate: () => alert('重新生成中...')
    }
}

export const CustomActions: Story = {
    args: {
        onCopy: () => console.log('复制'),
        onRegenerate: () => console.log('重新生成'),
        items: [
            {
                key: 'copy',
                label: '复制',
                icon: <span>📋</span>,
                onClick: () => alert('复制成功')
            },
            {
                key: 'edit',
                label: '纠错',
                icon: <span>✏️</span>,
                onClick: () => alert('进入纠错模式')
            },
            {
                key: 'like',
                label: '点赞',
                icon: <span>👍</span>,
                onClick: () => alert('已点赞')
            },
            {
                key: 'dislike',
                label: '点踩',
                icon: <span>👎</span>,
                onClick: () => alert('已点踩')
            },
            {
                key: 'share',
                label: '转发',
                icon: <span>↗️</span>,
                onClick: () => alert('已转发')
            }
        ]
    }
}

export const CopyOnly: Story = {
    args: {
        showRegenerate: false,
        onCopy: () => alert('已复制')
    }
}

export const RegenerateOnly: Story = {
    args: {
        showCopy: false,
        onRegenerate: () => alert('重新生成中...')
    }
}

export const NoDefaultButtons: Story = {
    args: {
        showCopy: false,
        showRegenerate: false,
        items: [
            {
                key: 'like',
                label: '有用',
                icon: <span>👍</span>,
                onClick: () => alert('感谢反馈')
            }
        ]
    }
}