export type ThemeMode = 'light' | 'dark'

export interface ConfigContextType {
    theme: ThemeMode
    primaryColor: string
    locale: Record<string, string>
    setTheme: (theme: ThemeMode) => void
    setPrimaryColor: (color: string) => void
    setLocale: (lang: string) => void
}