import type { Meta, StoryObj } from '@storybook/react'
import { ConfigProvider } from './ConfigProvider'
import { useConfig } from '../../hooks/useConfig'

const meta: Meta<typeof ConfigProvider> = {
    title: 'Components/ConfigProvider',
    component: ConfigProvider,
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ConfigProvider>

function DemoChild() {
    const { theme, primaryColor, locale, setTheme, setLocale } = useConfig();
    return (
        <div
            style={{
                padding: 24,
                background: theme === 'dark' ? '#lalala' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
                borderRadius: 8,
                border: `2px solid ${primaryColor}`
            }}
        >
            <p>
                <strong>当前主题: </strong>
                {theme}
            </p>
            <p>
                <strong>当前主色: </strong>
                <span style={{ color: primaryColor }}>{primaryColor}</span>
            </p>
            <p>
                <strong>国际化测试：</strong>
                {locale.send} / {locale.copy} / {locale.think}
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => setTheme('light')}>浅色</button>
                <button onClick={() => setTheme('dark')}>深色</button>
                <button onClick={() => setLocale('zh-CN')}>中文</button>
                <button onClick={() => setLocale('en-US')}>English</button>
            </div>
        </div>
    )
}

export const Default: Story = {
    args: {
        children:<DemoChild />
    }
}

export const DarkMode: Story = {
    args: {
        defaultTheme: 'dark',
        children:<DemoChild />
    }
}

export const CustomColor: Story = {
    args: {
        defaultPrimaryColor: '#e74c3c',
        children: <DemoChild />
    }
}