import { ButtonScene } from '@renderer/lib/react-scene'
import { ButtonPlayGame } from './components/button-play-game.component'

export const MenuScene = () => {
  const exitGamehandler = () => {
    window.electron.ipcRenderer.send('close-app')
  }

  const className = 'inline-block text-4xl p-4 w-96 uppercase border border-gray-500 rounded-xl'

  return (
    <div className="pt-48">
      <h1 className="text-7xl md:text-8xl mb-16 uppercase text-center text-gray-200">
        Teleturniej
      </h1>
      <div className="flex flex-col content-center w-fit text-center m-auto space-y-6">
        <ButtonPlayGame className={className} />
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
