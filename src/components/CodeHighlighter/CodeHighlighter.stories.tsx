import type { Meta, StoryObj } from '@storybook/react'
import { CodeHighlighter } from './CodeHighlighter'

const meta: Meta<typeof CodeHighlighter> = {
    title: 'Components/CodeHighlighter',
    component: CodeHighlighter,
    tags: ['autodocs']
}

export default meta
type Story =StoryObj<typeof CodeHighlighter>

const tsCode = `interface User {
    id: number
    name: string
    email: string
}
function greet(user: User): string {
    return \`Hello, \${user.name}!\`
}    

const user: User = {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com'
}

console.log(greet(user))`

const pythonCode = `def fibonacci(n: int) -> int:
    """返回第 n 个斐波那契数列"""
    if n <=1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    for i in range(10):
        print(f"fib({i}) = {fibonacci(i)}")

if __name__ == "__main__":
    main()`

const htmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>示例页面</title>
</head>
<body>
    <div id="app">
        <h1>Hello World</h1> 
    </div>
</body>
</html>`

const longCode = `//这是一个很长的代码文件，用语测试折叠功能
// 共有 50 行，超过默认的 15 行折叠阈值

const CONFIG = {
    API_URL: 'https://api.example.com',
    TIMEOUT: 5000,
    RETRY_COUNT: 3,
}

function initAPP() {
    console.log('初始化应用...')
}

function fetchUser(id: number) {
    return fetch(CONFIG.API_URL + '/users/' + id)
}

function handleError(err: Error) {
    console.error('发生错误:', err.message)
}

function logout() {
    localStorage.clear()
    window.location.href = '/login'
}

class EventBus {
    private events: Map<string, Function[]>

    constructor() {
       this.events = new Map()
    }

    on(event: string, handler: Function) {}
    off(event: string, handler: Function) {}
    emit(event: string, data: any) {}
}

const bus = new EventBus()
export { CONFIG, initAPP, fetchUser, handleError, logout, bus }`

export const TypeScript: Story = {
    args: {
        code: tsCode,
        language: 'typescript'
    }
}

export const Python: Story = {
    args: {
        code: pythonCode,
        language: 'python'
    }
}

export const HTML: Story = {
    args: {
        code: htmlCode,
        language: 'html'
    }
}

export const LongCode: Story = {
    args: {
        code: longCode,
        language: 'typescript',
        maxLines: 10
    }
}

export const NoLanguageLabel: Story = {
    args: {
        code: tsCode,
        language: 'typescript',
        showLanguage: false
    }
}

export const NoCopyButton: Story = {
    args: {
        code: pythonCode,
        language: 'python',
        showCopy: false
    }
}