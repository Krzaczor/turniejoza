import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  categories: {
    find: () => ipcRenderer.invoke('categories.find'),
    findOne: (id: string) => ipcRenderer.invoke('categories.findOne', id)
  },
  questions: {
    findByCategory: (id: string) => ipcRenderer.invoke('questions.findByCategory', id),
    removeAll: (id: string) => ipcRenderer.invoke('questions.removeByCategory', id)
  }
}

export type Api = typeof api

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
