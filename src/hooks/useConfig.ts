import { useContext } from 'react'
import { ConfigContext } from '../components/ConfigProvider/ConfigProvider'

export const useConfig = () => {
    const context = useContext(ConfigContext)
    if(!context) {
        throw new Error('useConfig must be used within a ConfigProvider')
    }
    return context
}