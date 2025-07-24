import { clsx } from 'clsx'
import { ButtonScene } from '@renderer/lib/react-scene'

export const MenuScene = () => {
  const exitGamehandler = () => {
    window.electron.ipcRenderer.send('close-app')
  }

  const className = 'inline-block text-4xl p-3 m-3 w-96 uppercase border rounded-xl'

  return (
    <div className="mt-48">
      <h1 className="text-8xl mb-16 uppercase text-center">Teleturniej</h1>
      <div className="flex flex-col content-center w-fit text-center m-auto">
        <ButtonScene scene="game" className={clsx(className, 'bg-gray-400 text-blue-950')}>
          Graj
        </ButtonScene>
        <ButtonScene scene="questions" className={className}>
          Pytania
        </ButtonScene>
        <button className={className} onClick={exitGamehandler}>
          Zamknij
        </button>
      </div>
    </div>
  )
}
