import { useState } from 'react'
import { Settings, Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useSettings } from '../context/SettingsContext'

const LP_PRESETS = [4000, 8000] as const

export function SettingsDialog() {
  const { settings, setSettings } = useSettings()
  const [open, setOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const MAX_SET_PRESETS = [3, 5] as const

  const handleOpen = (val: boolean) => {
    if (val) {
      setSyncError(null)
    }
    setOpen(val)
  }

  const handleSync = async () => {
    setSyncing(true)
    setSyncError(null)
    try {
      const startDate = settings.lastSync ?? new Date().toISOString().split('T')[0]
      await window.api.syncCards(startDate)
      setSettings({ lastSync: new Date().toISOString().split('T')[0] })
    } catch (e) {
      setSyncError(`Sync failed ${e}`)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-lg" title="Settings">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark / Light mode</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettings({ darkMode: !settings.darkMode })}
            >
              {settings.darkMode ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              {settings.darkMode ? 'Light' : 'Dark'}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Card image size</span>
            <div className="flex gap-2">
              {(['large', 'small'] as const).map((size) => (
                <Button
                  key={size}
                  variant={settings.cardImageSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSettings({ cardImageSize: size })}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Starting LP</span>
            <div className="flex gap-2">
              {LP_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={settings.startingLP === preset ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSettings({ startingLP: preset })
                  }}
                >
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Max set cards</span>
            <div className="flex gap-2">
              {MAX_SET_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={settings.maxSetCards === preset ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSettings({ maxSetCards: preset })
                  }}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Sync Cards</span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {settings.lastSync
                  ? `Last synced: ${settings.lastSync.split('-').reverse().join('/')}`
                  : 'Never synced'}
              </span>
              <Button size="sm" variant="outline" onClick={handleSync} disabled={syncing}>
                {syncing ? 'Syncing…' : 'Sync now'}
              </Button>
            </div>
            {syncError && <span className="text-xs text-destructive">{syncError}</span>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
