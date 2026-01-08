"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getSupabaseBrowser } from "@/lib/supabase/browser"
import { initAuthListener } from "@/lib/supabase/client"
import type { UserStateData } from "@/lib/types/user-state"

const UserStateContext = createContext<UserStateData | null>(null)

export function UserStateProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<UserStateData>({
    state: "LOADING",
  })

  const supabase = getSupabaseBrowser()

  useEffect(() => {
    initAuthListener()

    const checkUserState = async () => {
      console.log("[STATE-LOG] Checking user state...")

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.log("[STATE-LOG] No user session → SESSION_EXPIRED")
        setUserState({ state: "SESSION_EXPIRED" })
        return
      }

      console.log("[STATE-LOG] User found:", user.id, user.email)

      // Check if this is a password recovery flow
      const recoveryFlag = sessionStorage.getItem("password_recovery")
      if (recoveryFlag === "true") {
        console.log("[STATE-LOG] Password recovery flow detected → PASSWORD_RECOVERY")
        setUserState({
          state: "PASSWORD_RECOVERY",
          userId: user.id,
          userEmail: user.email,
          isRecovery: true,
        })
        return
      }

      // Check profile and workspace
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("current_workspace_id, has_seen_onboarding")
        .eq("id", user.id)
        .single()

      if (profileError || !profile) {
        console.log("[STATE-LOG] No profile found → NEW_USER")
        setUserState({
          state: "NEW_USER",
          userId: user.id,
          userEmail: user.email,
        })
        return
      }

      if (!profile.current_workspace_id) {
        console.log("[STATE-LOG] Profile exists but no workspace → EXISTING_NO_WS")
        setUserState({
          state: "EXISTING_NO_WS",
          userId: user.id,
          userEmail: user.email,
          hasSeenOnboarding: profile.has_seen_onboarding,
        })
        return
      }

      console.log("[STATE-LOG] Profile and workspace exist → EXISTING_WITH_WS")
      setUserState({
        state: "EXISTING_WITH_WS",
        userId: user.id,
        userEmail: user.email,
        workspaceId: profile.current_workspace_id,
        hasSeenOnboarding: profile.has_seen_onboarding,
      })
    }

    checkUserState()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[STATE-LOG] Auth state changed:", event)

      if (event === "SIGNED_OUT") {
        console.log("[STATE-LOG] User signed out → SESSION_EXPIRED")
        setUserState({ state: "SESSION_EXPIRED" })
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        checkUserState()
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("[STATE-LOG] Password recovery initiated → PASSWORD_RECOVERY")
        sessionStorage.setItem("password_recovery", "true")
        setUserState({
          state: "PASSWORD_RECOVERY",
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          isRecovery: true,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return <UserStateContext.Provider value={userState}>{children}</UserStateContext.Provider>
}

export function useUserState() {
  const context = useContext(UserStateContext)
  if (context === null) {
    throw new Error("useUserState must be used within UserStateProvider")
  }
  return context
}
