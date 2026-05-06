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

function CustomDurationDemo() {
  function show(duration: number) {
    notify.success(`这条通知 ${duration} 秒后消失`, duration)
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => show(1000)}>1秒</button>
      <button onClick={() => show(3000)}>3秒</button>
      <button onClick={() => show(8000)}>8秒</button>
      <button onClick={() => notify.error('手动关闭', 0)}>永久（可手动关闭）</button>
    </div>
  )
}

export const CustomDuration: StoryObj = {
  render: () => <CustomDurationDemo />
}