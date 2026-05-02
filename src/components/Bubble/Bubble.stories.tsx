import type { Meta, StoryObj } from '@storybook/react'
import { Bubble } from './Bubble'   

const meta: Meta<typeof Bubble> = {
    title: 'Components/Bubble',
    component: Bubble,
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Bubble>

export const AI: Story = {
    args: {
        position: 'left',
        avatar: '🤖',
        timestamp: Date.now(),
        status: 'sent',
        children: '你好！我是AI助手， 有什么可以帮助你的吗'
    }
}

export const User: Story = {
    args: {
        position: 'right',
        avatar: '😊',
        timestamp: Date.now() - 60000,
        status: 'sent',
        children: '帮我写一段代码'
    }
}

export const Sending: Story = {
    args: {
        position: 'right',
        avatar: '😊',
        timestamp: Date.now(),
        status: 'sending',
        children: '帮我写一段代码'
    }
}

export const Failed: Story = {
    args: {
        position: 'right',
        avatar: '😊',
        timestamp: Date.now(),
        status: 'failed',   
        children: '帮我写一段代码'
    }
}

export const LongText: Story = {
    args: {
        position: 'left',
        avatar: '🤖',
        timestamp: Date.now(),
        status: 'sent',
        children: '这是一段很长的回复内容。用于测试气泡组件在长文本情况下的展示效果。React 是一个用于构建用户界面的 JavaScript 库。它采用组件化的开发方式，让开发者可以将 UI 拆分为独立、可复用的组件。'
    }
}

export const NoAvatar: Story = {
    args: {
        position: 'right',
        timestamp: Date.now(),
        status: 'sent',
        children: '没有头像的消息起泡'
    }
}