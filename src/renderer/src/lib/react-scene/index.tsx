import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type PropsWithChildren,
  type ButtonHTMLAttributes
} from 'react'

interface ScenesContextValue {
  changeScene(nextScene: string): void
  isCurrentScene(name: string): boolean
}

const SceneContext = createContext<ScenesContextValue | null>(null)

const useSceneContext = () => {
  const context = useContext(SceneContext)

  if (!context) {
    throw Error('useSceneContext must be into Scenes')
  }

  return context
}

interface ScenesProps extends PropsWithChildren {
  main: string
}

export const Scenes = ({ children, main }: ScenesProps) => {
  const [scene, setScene] = useState(main)

  const isCurrentScene = (name: string) => {
    return scene === name
  }

  const changeScene = (nextScene: string) => {
    if (nextScene === scene) {
      return
    }

    setScene(nextScene)
  }

  const value = {
    changeScene,
    isCurrentScene
  }

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

interface SceneProps {
  name: string
  element: ReactNode
}

export const Scene = ({ name, element }: SceneProps) => {
  const { isCurrentScene } = useSceneContext()

  if (!isCurrentScene(name)) {
    return null
  }

  return element
}

interface ButtonSceneProps extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  scene: string
}

export const ButtonScene = ({ children, scene, ...props }: ButtonSceneProps) => {
  const { changeScene } = useSceneContext()

  const changeSceneHandler = () => {
    changeScene(scene)
  }

  return (
    <button {...props} onClick={changeSceneHandler}>
      {children}
    </button>
  )
}
