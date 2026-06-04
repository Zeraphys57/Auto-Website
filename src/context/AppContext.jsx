import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [framesReady, setFramesReady] = useState(false)
  const [currentAct, setCurrentAct] = useState(1)
  const [toasts, setToasts] = useState([])

  // Use a ref for unique IDs to keep the render pure while avoiding Date.now() / Math.random() directly in the render flow context
  const toastIdRef = useRef(0)

  const addToast = (message, type = 'info') => {
    toastIdRef.current += 1
    const id = toastIdRef.current.toString()
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto-remove after 5s
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
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
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
