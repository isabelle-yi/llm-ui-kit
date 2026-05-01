import type { Preview } from '@storybook/react'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                colors: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
}

export default preview