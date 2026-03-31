import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getCardById: (id: number) => Promise<unknown>
    }
  }
}
