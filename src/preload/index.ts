import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getCardById: (id: number) => ipcRenderer.invoke('get-card-by-id', id),
  getCardByName: (name: string) => ipcRenderer.invoke('get-card-by-name', name),
  getCardsByName: (name: string) => ipcRenderer.invoke('get-cards-by-name', name),
  getAllCardNames: (): Promise<string[]> => ipcRenderer.invoke('get-all-card-names'),
  getAllCardsBasic: (): Promise<{ name: string; type: string }[]> => ipcRenderer.invoke('get-all-cards-basic'),
  getAllDecks: () => ipcRenderer.invoke('get-all-decks'),
  createDeck: (name: string, coverCardId: number | null) => ipcRenderer.invoke('create-deck', name, coverCardId),
  deleteDeck: (id: number) => ipcRenderer.invoke('delete-deck', id),
  getNegatesForDeck: (deckId: number) => ipcRenderer.invoke('get-negates-for-deck', deckId),
  createNegate: (targetDeckId: number, negateCardId: number, targetCardId: number, note?: string) => ipcRenderer.invoke('create-negate', targetDeckId, negateCardId, targetCardId, note),
  deleteNegate: (id: number) => ipcRenderer.invoke('delete-negate', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
