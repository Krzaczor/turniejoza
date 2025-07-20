function App() {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <button className="px-3 py-2 m-5 border rounded-lg" onClick={ipcHandle}>
      Send IpcRenderer
    </button>
  )
}

export default App
