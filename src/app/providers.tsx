"use client"

import { ReactNode } from "react"
import { StoreProvider } from "@/contexts/StoreContext"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      {children}
      <Toaster />
    </StoreProvider>
  )
}
