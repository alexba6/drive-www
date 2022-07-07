import { FunctionComponent, createContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextProps = {
    theme: Theme,
    toggleTheme: (theme?: Theme) => void
}

type ThemeWrapperProps = {
    children: ReactNode
}

const STORAGE_KEY = 'THEME'

export const ContextTheme = createContext<ThemeContextProps>({
    theme: 'light',
    toggleTheme: () => {}
})

export const ThemeProvider: FunctionComponent<ThemeWrapperProps> = (props) => {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEY)
        if (savedTheme === 'dark') {
            toggleTheme('dark')
        }
    }, [])

    const toggleTheme = (forceTheme?: Theme) => setTheme(oldTheme => {
        const newTheme = (forceTheme === 'light' || forceTheme === 'dark') ? forceTheme : (oldTheme === 'light' ? 'dark' : 'light')
        localStorage.setItem(STORAGE_KEY, newTheme)
        document.querySelector('html')?.setAttribute('theme', newTheme)
        return newTheme
    })

    const themeValue: ThemeContextProps = {
        theme, toggleTheme
    }

    return (
        <ContextTheme.Provider value={themeValue}>
            {props.children}
        </ContextTheme.Provider>
    )
}
