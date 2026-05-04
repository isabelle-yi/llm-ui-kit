import type { Meta, StoryObj } from '@storybook/react'
import { notify } from './NotificationManager'

const meta: Meta = {
    title: 'Components/Notification',
    tags: ['autodocs']
}

export default meta

function Demo() {
    return (
        <div style={{ display: 'flex',gap: 8 }}>
            <button onClick={() => notify.success('操作成功！')}>成功通知</button>
            <button onClick={() => notify.error('操作失败，请重试')}>失败通知</button>
            <button onClick={() => notify.loading('正在加载...', 5000)}>加载通知(5秒)</button>
            <button onClick={() => notify.success('不会自动消失', 0)}>永久通知</button>
        </div>
    )
}

export const Default: StoryObj = {
    render: () => <Demo />
}