import { createContext, useState, type ReactNode } from 'react'
import type { ConfigContextType, ThemeMode } from './config'
import zhCN from '../../locales/zh-CN'
import enUS from '../../locales/en-US'

const localeMap: Record<string, Record<string, string>> = {
    'zh-CN': zhCN,
    'en-US': enUS
}

export const ConfigContext = createContext<ConfigContextType | null>(null)

interface ConfigProviderProps {
    children: ReactNode
    defaultTheme?: ThemeMode
    defaultPrimaryColor?: string
    defaultLang?: string
}

export function ConfigProvider({
    children,
    defaultTheme = 'light',
    defaultPrimaryColor = '#1890ff',
    defaultLang = 'zh-CN'
}: ConfigProviderProps) {
    const [theme, setTheme] = useState<ThemeMode>(defaultTheme)
    const [primaryColor, setPrimaryColor] = useState(defaultPrimaryColor)
    const [locale, setLocaleState] = useState(localeMap[defaultLang] || zhCN)

    function setLocale(lang: string) {
        setLocaleState(localeMap[lang] || zhCN)
    }

    const contextValue: ConfigContextType = {
        theme,
        primaryColor,
        locale,
        setTheme,
        setPrimaryColor,
        setLocale
    }

    return (
        <ConfigContext.Provider value={contextValue}>
            <div data-theme={theme} style={{ '--primary-color': primaryColor} as React.CSSProperties}>
                {children}
            </div>
        </ConfigContext.Provider>
    )
}