import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [framesReady, setFramesReady] = useState(false)
  const [currentAct, setCurrentAct] = useState(1)

  return (
    <AppContext.Provider
      value={{
        isLoaded,
        setIsLoaded,
        framesReady,
        setFramesReady,
        currentAct,
        setCurrentAct,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
