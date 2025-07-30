import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { createTableCategories } from './features/category/category.schema'
import { createTableQuestions } from './features/question/question.schema'
import { createTableAnswers } from './features/answer/answer.schema'

import { categoryService } from './features/category/category.service'
import { questionService } from './features/question/question.service'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    fullscreen: !is.dev
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Obsługa skrótów klawiszowych przez electron
  mainWindow.webContents.on('before-input-event', (event, input) => {
    event.preventDefault()

    // alt+enter - przełacza między fullscreen, a okienkiem
    if (input.alt && input.key === 'Enter') {
      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false)
      } else {
        mainWindow.setFullScreen(true)
      }
    }
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

  ipcMain.on('close-app', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Tutaj zaczynają się nasze wypociny
  // -------

  await createTableCategories().catch(console.log)
  await createTableQuestions().catch(console.log)
  await createTableAnswers().catch(console.log)

  if (is.dev) {
    const { insertMocks } = await import('./database/database.mock')
    await insertMocks().catch((error) => console.log(error))
  }

  ipcMain.handle('categories.find', () => categoryService.find())
  ipcMain.handle('categories.findOne', (_, id: string) => categoryService.findOne(id))
  ipcMain.handle('questions.findByCategory', (_, id: string) => questionService.findByCategory(id))

  // -------
  // Tutaj kończą się nasze wypociny
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
