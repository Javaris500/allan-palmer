"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuthTab = "signin" | "register"

interface AuthModalContextValue {
  /** Whether the auth modal is currently visible. */
  isOpen: boolean
  /** The currently active tab inside the modal. */
  activeTab: AuthTab
  /** Open the modal, optionally specifying which tab to show first. */
  openAuthModal: (tab?: AuthTab) => void
  /** Close the modal and reset transient state. */
  closeAuthModal: () => void
  /** Programmatically switch the active tab without opening / closing. */
  setActiveTab: (tab: AuthTab) => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthModalContext = createContext<AuthModalContextValue | undefined>(
  undefined,
)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AuthTab>("signin")

  const openAuthModal = useCallback((tab: AuthTab = "signin") => {
    setActiveTab(tab)
    setIsOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = useMemo<AuthModalContextValue>(
    () => ({
      isOpen,
      activeTab,
      openAuthModal,
      closeAuthModal,
      setActiveTab,
    }),
    [isOpen, activeTab, openAuthModal, closeAuthModal],
  )

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error(
      "useAuthModal must be used within an <AuthModalProvider>. " +
        "Wrap a parent component with <AuthModalProvider> to fix this.",
    )
  }
  return context
}
