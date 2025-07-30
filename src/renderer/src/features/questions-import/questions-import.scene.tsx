import { useEffect, useState } from 'react'

export const QuestionsImportScene = () => {
  const [fileContent, setFileContent] = useState('')

  const openUploadWindow = () => {
    window.electron.ipcRenderer.send('open-file-dialog')
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('insert-success', (_, file) => {
      setFileContent(file)
    })
  }, [])

  return (
    <div className="min-h-dvh p-8 pt-16 text-center">
      <div className="mb-8">
        <h1 className="text-4xl">QuestionsImportScene</h1>
      </div>
      <button className="text-xl" id="upload" onClick={openUploadWindow}>
        importuj dane
      </button>
      <div>{fileContent && <pre>{JSON.stringify(fileContent, null, 3)}</pre>}</div>
    </div>
  )
}
