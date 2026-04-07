import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDb } from './handlers/initdb'
import { getCardById, getCardByName, getCardsByName, getAllCardNames, getAllCardsBasic } from './handlers/cards'
import { getAllDecks, createDeck, updateDeck, deleteDeck, getNegatesForDeck, createNegate, deleteNegate } from './handlers/negates'
import { getAllCombos, createCombo, updateCombo, deleteCombo, getStepsForCombo, addComboStep, deleteComboStep, updateComboStepNote, updateComboStepLink, reorderComboSteps } from './handlers/combos'
import { syncCards } from './handlers/syncCards'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await initDb()

  ipcMain.handle('get-card-by-id', (_, id: number) => getCardById(id))
  ipcMain.handle('get-card-by-name', (_, name: string) => getCardByName(name))
  ipcMain.handle('get-cards-by-name', (_, name: string) => getCardsByName(name))
  ipcMain.handle('get-all-card-names', () => getAllCardNames())
  ipcMain.handle('get-all-cards-basic', () => getAllCardsBasic())

  ipcMain.handle('get-all-decks', () => getAllDecks())
  ipcMain.handle('create-deck', (_, name: string, coverCardId: number | null) => createDeck(name, coverCardId))
  ipcMain.handle('update-deck', (_, id: number, name: string, coverCardId: number | null) => updateDeck(id, name, coverCardId))
  ipcMain.handle('delete-deck', (_, id: number) => deleteDeck(id))
  ipcMain.handle('get-negates-for-deck', (_, deckId: number) => getNegatesForDeck(deckId))
  ipcMain.handle('create-negate', (_, targetDeckId: number, negateCardId: number, targetCardId: number, note?: string) => createNegate(targetDeckId, negateCardId, targetCardId, note))
  ipcMain.handle('delete-negate', (_, id: number) => deleteNegate(id))

  ipcMain.handle('get-all-combos', () => getAllCombos())
  ipcMain.handle('create-combo', (_, name: string, coverCardId: number | null) => createCombo(name, coverCardId))
  ipcMain.handle('update-combo', (_, id: number, name: string, coverCardId: number | null) => updateCombo(id, name, coverCardId))
  ipcMain.handle('delete-combo', (_, id: number) => deleteCombo(id))
  ipcMain.handle('get-steps-for-combo', (_, comboId: number) => getStepsForCombo(comboId))
  ipcMain.handle('add-combo-step', (_, comboId: number, cardId: number, note: string | null, linkComment: string | null, position: number) => addComboStep(comboId, cardId, note, linkComment, position))
  ipcMain.handle('delete-combo-step', (_, id: number) => deleteComboStep(id))
  ipcMain.handle('update-combo-step-note', (_, id: number, note: string | null) => updateComboStepNote(id, note))
  ipcMain.handle('update-combo-step-link', (_, id: number, linkComment: string | null) => updateComboStepLink(id, linkComment))
  ipcMain.handle('reorder-combo-steps', (_, orderedIdsJson: string) => reorderComboSteps(JSON.parse(orderedIdsJson)))

  ipcMain.handle('sync-cards', (_, startDate: string) => syncCards(startDate))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
