import type { Meta, StoryObj } from '@storybook/react'
import { Mark } from './Mark'

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
`

export const Default: Story = {
    args: {
        content: demoContent
    }
}

const longContent = Array.from({ length: 30 }, (_, i) => `这是第${i+1}行内容，用于测试超长文本自动折叠功能。`).join('\n\n')

export const FoldLongText: Story = {
    args: {
        content: longContent,
        maxRows: 10
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
