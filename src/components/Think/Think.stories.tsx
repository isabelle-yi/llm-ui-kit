import type { Meta, StoryObj } from '@storybook/react'
import { Think } from './Think'

const meta: Meta<typeof Think> = {
    title: 'Components/Think',
    component: Think,
    tags: ['autidics']
}

export default meta
type Story = StoryObj<typeof Think>

export const Thinking: Story = {
    args: {
        status: 'thinking',
        thinkingText: '正在思考...',
        children: '我需要先理解用户的问题，然后从知识库中检索相关信息，最后组织语言给出准确的回答。'
    }
}

export const Done: Story = {
    args: {
        status: 'done',
        doneText: '思考完成',
        children: '用户想了解 React和 Vue 的区别。两者都是前端框架，React 更灵活，Vue 上手更简单。'
    }
}

export const CustomText: Story = {
    args: {
        status: 'thinking',
        thinkingText: 'AI 正在分析您的问题...',
        doneText: '分析完毕',
        children: '正在检索相关文档并生成回答...'
    }
}

export const DefaultExpanded: Story = {
    args: {
        status: 'done',
        doneText: '思考完成',
        defaultExpanded: true,
        children: '这份思考内容默认就是展开的，用户不需要再点击。适用于首次展示场景。'
    }
}

export const EmptyContent: Story = {
    args: {
        status: 'thinking',
        thinkingText: '处理中...'
    }
}