export interface ChatMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export async function chatStream(
    messages: ChatMessage[],
    onChunk: (data: { type: 'content' | 'reasoning'; text: string }) => void,
    onDone: () => void,
    onError: (err: Error) => void
){
    const apiKey = import.meta.env.VITE_API_KEY

    if (!apiKey) {
        onError(new Error('API Key 未配置，请在 .env 文件中设置 VITE_API_KEY'))
        return
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-reasoner',
                messages,
                stream: true
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            const message = errorData?.error?.message || `请求失败 (${response.status})`
            throw new Error(message)
        }

        const reader = response.body?.getReader()
        if(!reader) {
            throw new Error('无法获取相应流')
        }

        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                onDone()
                break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                const trimmed = line.trim()
                if(!trimmed || !trimmed.startsWith('data: ')) continue

                const data = trimmed.slice(6)
                if (data === '[DONE]') {
                    onDone()
                    return
                }

                try {
                    const json = JSON.parse(data)
                    const delta = json.choices?.[0]?.delta
                    if (delta?.reasoning_content) {
                          onChunk({ type: 'reasoning', text: delta.reasoning_content })
                        }
                        if (delta?.content) {
                          onChunk({ type: 'content', text: delta.content })
                        }
                    
                } catch {

                }
            }
        }
    } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)))
    }
}