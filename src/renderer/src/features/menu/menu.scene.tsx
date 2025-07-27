import { clsx } from 'clsx'
import { ButtonScene } from '@renderer/lib/react-scene'

export const MenuScene = () => {
  const exitGamehandler = () => {
    window.electron.ipcRenderer.send('close-app')
  }

  const className = 'inline-block text-4xl p-3 m-3 w-96 uppercase border rounded-xl'

  return (
    <div className="pt-48 h-s">
      <h1 className="text-7xl md:text-8xl mb-16 uppercase text-center text-indigo-100">
        Teleturniej
      </h1>
      <div className="flex flex-col content-center w-fit text-center m-auto">
        <ButtonScene
          scene="game-config"
          className={clsx(
            className,
            'bg-gray-400 text-blue-950 hover:bg-gray-300/85 disabled:text-gray-400 disabled:bg-gray-600 disabled:cursor-not-allowed'
          )}
          disabled={false} // to będzie blokada jeśli baza z pytaniami jest pusta
        >
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
