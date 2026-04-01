import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getCardById: (id: number) => Promise<unknown>
      getCardByName: (name: string) => Promise<unknown>
      getCardsByName: (name: string) => Promise<unknown>
      getAllCardNames: () => Promise<string[]>
      getAllCardsBasic: () => Promise<{ name: string; type: string }[]>
    }
  }
}
