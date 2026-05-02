import type { Meta, StoryObj } from '@storybook/react'
import { Sender } from './Sender'
import { useState } from 'react'

const meta: Meta<typeof Sender> = {
    title:'Components/Sender',
    component: Sender,
    tags: ['autodocs']
}

export default meta 
type Story = StoryObj<typeof Sender>

export const Default: Story = {
    args: {
        placeholder: '输入消息，Enter 发送， Shift+Enter 换行'
    }
}

export const Disabled: Story = {
    args: {
        placeholder: '输入框禁用',
        disabled: true
    }
}

function LoadingDemo() {
    const [loading, setLoading] = useState(false);

    function handleSend(text: string) {
        setLoading(true)
        setTimeout(() =>  setLoading(false), 3000)
    }

    return <Sender loading={loading} onSend={handleSend}/>
}

export const Loading: Story = {
    render: () => <LoadingDemo/>
}