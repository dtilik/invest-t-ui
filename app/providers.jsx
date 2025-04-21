'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem 
      disableTransitionOnChange
      forcedTheme="dark" // Force dark theme initially
    >
      {children}
    </ThemeProvider>
  )
}
