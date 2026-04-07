import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Settings {
  startingLP: number
  darkMode: boolean
  cardImageSize: 'large' | 'small'
  maxSetCards: number
}

const DEFAULTS: Settings = { startingLP: 8000, darkMode: true, cardImageSize: 'large', maxSetCards: 5 }
const STORAGE_KEY = 'app-settings'

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

interface SettingsContextValue {
  settings: Settings
  setSettings: (patch: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const setSettings = (patch: Partial<Settings>) =>
    setSettingsState((prev) => ({ ...prev, ...patch }))

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
