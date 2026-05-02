import { useState, useRef, useCallback, type KeyboardEvent, type CompositionEvent } from 'react'
import './Sender.less'

export interface SenderProps {
    placeholder?: string
    disabled?: boolean
    loading?: boolean
    onSend?: (text: string) => void
}

export function Sender({
    placeholder = '输入消息...',
    disabled = false,
    loading = false,
    onSend
}: SenderProps) {
    const [value, setValue] = useState('')
    const isComposing = useRef(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustHeight = useCallback(() => {
        const el = textareaRef.current
        if(!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    },[])

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value)
        adjustHeight()
    }

    function handleCompositionStart() {
        isComposing.current = true
    }

    function handleCompositionEnd(e: CompositionEvent<HTMLTextAreaElement>) {
        isComposing.current = false
        setValue((e.target as HTMLTextAreaElement).value)
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing.current) {
            e.preventDefault()
            send()
        }
    }

    function send() {
        const text = value.trim()
        if (!text || disabled || loading) return
        onSend?.(text)
        setValue('')
    }

    const canSend = value.trim().length > 0 && !disabled && !loading

    return (
        <div className={`sender ${disabled ? 'sender-disabled' : ''} ${loading ? 'sender-loading' : ''}`}>
            <textarea
               ref={textareaRef}
               className="sender-textarea"
               value={value}
               onChange={handleChange}
               onCompositionStart={handleCompositionStart}
               onCompositionEnd={handleCompositionEnd}
               onKeyDown={handleKeyDown}
               placeholder={placeholder}
               disabled={disabled || loading}
               rows={1}
            />
            <button className="sender-btn" onClick={send} disabled={!canSend}>
                {loading ? <span className="sender-spinner" /> : '发送'}
            </button>
        </div>
    )
}