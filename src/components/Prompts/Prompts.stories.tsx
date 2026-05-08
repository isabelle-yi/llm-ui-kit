import type { Meta, StoryObj } from '@storybook/react'
import { Prompts, type PromptItem } from './Prompts'

const meta: Meta<typeof Prompts> = {
    title: 'Components/Prompts',
    component: Prompts,
    tags: ['autodocs']
}

export default meta
type Story =  StoryObj<typeof Prompts>

const sampleItems: PromptItem[] = [
    { key: '1', title: '帮我写一封辞职信', icon: '✉️' },
    { key: '2', title: '解释什么是量子计算', icon: '🔬'},
    { key: '3', title: '用 TypeScript 写一个排序算法', icon: '💻'},
    { key: '2', title: '帮我翻译一段英文', icon: '🌐'},
]

const itemswithDesc: PromptItem[] = [
    {
        key: '1',
        title: '工作总结',
        description: '帮你生成一份周报或月度总结',
        icon: '📝'
    },
    {
        key: '2',
        title: '代码解释',
        description: '逐行解释代码的含义和逻辑',
        icon: '💡'
    },
    {
        key: '3',
        title: '文案润色',
        description: '优化文字表达，让内容更专业',
        icon: '✨'
    }
]

export const Default: Story = {
    args: {
        items: sampleItems,
        onSelect: (item) => alert(`选中了：${item.title}`)
    }
}

export const WithDescriptions: Story = {
    args: {
        items: itemswithDesc,
        title: '常用提示词',
        onSelect: (item) => console.log('选中', item)
    }
}

export const NoIcon: Story = {
    args: {
        items: [
            { key: 'a', title: '今天天气怎么样'},
            { key: 'b', title: '推荐一部好看的电影'},
            { key: 'c', title: '怎么做红烧肉'}
        ]
    }
}

export const WithTitle: Story = {
    args: {
        title: '✨ 试试这些',
        items: sampleItems
    }
}