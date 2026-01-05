export type UserState =
  | "NEW_USER" // First time signup, no workspace
  | "EXISTING_NO_WS" // Has account but no workspace
  | "EXISTING_WITH_WS" // Has account and workspace
  | "GUEST" // Portal guest user
  | "SESSION_EXPIRED" // Session expired or invalid
  | "PASSWORD_RECOVERY" // Password reset flow
  | "LOADING" // Initial state

export interface UserStateData {
  state: UserState
  userId?: string
  userEmail?: string
  workspaceId?: string
  hasSeenOnboarding?: boolean
  isRecovery?: boolean
}
