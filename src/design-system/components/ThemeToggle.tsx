// design-system/components/ThemeToggle.tsx
'use client'

import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../theme/ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="Light mode"
      >
        <SunIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="Dark mode"
      >
        <MoonIcon className="h-5 w-5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md ${theme === 'system' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-label="System preference"
      >
        <ComputerDesktopIcon className="h-5 w-5" />
      </button>
    </div>
  )
}