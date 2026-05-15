import type { Meta, StoryObj } from '@storybook/react'
import { Mark } from './Mark'
import { useState, useEffect, useRef } from 'react'
import { chatStream } from '../../services/api'

const meta: Meta<typeof Mark> = {
    title: "Components/Mark",
    component: Mark,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Mark>

const demoContent = `# Markdown 渲染测试

## 标题测试

这是一段**加粗**的文字，还有\`行内代码\`。

## 列表测试

- 项目一
- 项目二
- 项目三

1. 有序第一
2. 有序第二
3. 有序第三

## 表格测试

| 名称 | 版本 | 状态 |
|------|------|------|
| React | 18.3.1 | ✅ |
| Vite | 5.4.11 | ✅ |

## 引用测试

> 这是一段引用的文字
> 可以有多行

## 代码测试

\`\`\`typescript
function hello(name: string): string {
  return \`Hello, \${name}!\`
}

hello('World')
\`\`\`

## 链接测试

访问 [React 官网](https://react.dev) 了解更多。

## 图片测试

![示例图片](https://picsum.photos/400/200)
`

export const Default: Story = {
    args: {
        content: demoContent
    }
}

export const CodeOnly: Story = {
    args: {
        content: `\`\`\`python
def fibonacci(n):
        if n <= 1:
           return n
        return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
        print(fibonacci(i))         
\`\`\``
    }
}

export const WithImage: Story = {
  args: {
    content: `## 图片渲染测试

下面是一张示例图片：

![示例图片](https://picsum.photos/400/200)

图片下方继续显示文字，验证图片渲染和排版是否正常。`
  }
}

// ========== 模拟打字机 ==========

function SimulatedStreamDemo() {
    const fullText = `## 流式渲染测试
    
    这是一段**模拟打字机效果**的文本

    \`\`\`typescript
    const greeting: string = "Hello, World!"
    console.log(greeting)
    \`\`\`

    > 流式输出时， 内容逐字显示出现，模拟打字机效果。

    1.第一步：加载文本
    2.第二步：逐字显示
    3.第三步：完成渲染`
      
    const [displayText, setDisplayText] = useState('')
    const [streaming, setStreaming] = useState(false)
    const indexRef = useRef(0)
     
    function start() {
        setDisplayText('')
        setStreaming(true)
        indexRef.current = 0
    }

    useEffect(() => {
        if (!streaming) return
        if (indexRef.current >= fullText.length) {
            setStreaming(false)
            return
        }
        const timer = setInterval(() => {
            indexRef.current++
            setDisplayText(fullText.slice(0, indexRef.current))
            if (indexRef.current >= fullText.length) {
                setStreaming(false)
                clearInterval(timer)
            }
        }, 20)
        return () => clearInterval(timer)
    }, [streaming])

    return (
        <div>
            <button onClick={start} disabled={streaming} style={{ marginBottom: 12 }}>
                {streaming ? '输出中...' : '开始模拟流式输出'}
            </button>
            <Mark content={displayText} streaming={streaming}/>
        </div>
    )
}

export const SimulatedStream: Story = {
    render: () => <SimulatedStreamDemo />
}

// ========== 真实 API 流式 ==========

function RealAPIStreamDemo() {
    const [displayText, setDisplayText] = useState('')
    const [streaming, setStreaming] = useState(false)

    function start() {
        setDisplayText('')
        setStreaming(true)

        chatStream(
            [{ role: 'user', content: '用 Markdown 格式介绍一下 TypeScript，包括标题、列表和一段代码示例'}],
            (chunk) => { setDisplayText(prev => prev + chunk) },
            () => { setStreaming(false) },
            (err) => { setDisplayText(`✗错误：${err.message}`); setStreaming(false) }
        )
    }

    return (
        <div>
            <button onClick={start} disabled={streaming} style={{ marginBottom: 12 }}>
                {streaming ? 'AL回复中...' : '调用真实API流式输出'}
            </button>
            {displayText && <Mark content={displayText} streaming={streaming} />}
        </div>
    )
}

export const RealAPIStream: Story = {
    render: () => <RealAPIStreamDemo />
}