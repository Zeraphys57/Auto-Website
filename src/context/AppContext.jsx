import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [framesReady, setFramesReady] = useState(false)
  const [currentAct, setCurrentAct] = useState(1)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' })

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type })
  }

  const hideToast = () => {
    setToast((prev) => prev.isVisible ? { ...prev, isVisible: false } : prev)
  }

  return (
    <AppContext.Provider
      value={{
        isLoaded,
        setIsLoaded,
        framesReady,
        setFramesReady,
        currentAct,
        setCurrentAct,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
