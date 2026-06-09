import React, { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/expo"
import { tokenCache } from "@clerk/expo/token-cache"
import { setAuthTokenProvider } from "./apiClient"

// Cache strategy for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

const ApiAuthBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { getToken } = useAuth()
  setAuthTokenProvider(() => getToken())

  return <>{children}</>
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Get Clerk publishable key from environment - you'll need to set this in app.json extra
  // or as an environment variable
  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkPublishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY")
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        tokenCache={tokenCache}
      >
        <ClerkLoaded>
          <ApiAuthBridge>{children}</ApiAuthBridge>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  )
}

export default Providers
