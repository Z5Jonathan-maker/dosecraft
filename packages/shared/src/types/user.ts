// ---------------------------------------------------------------------------
// User domain types
// ---------------------------------------------------------------------------

/** Application role */
export type UserRole = 'user' | 'admin' | 'moderator';

/** OAuth / credential provider */
export type AuthProvider = 'email' | 'google' | 'apple' | 'github';

/** Goal tags available for protocol targeting */
export type GoalTag =
  | 'fat_loss'
  | 'recomp'
  | 'performance'
  | 'longevity'
  | 'aesthetics_face'
  | 'aesthetics_skin'
  | 'aesthetics_hair'
  | 'aesthetics_muscle'
  | 'healing'
  | 'cognitive'
  | 'sleep'
  | 'libido'
  | 'immune';

// ---------------------------------------------------------------------------
// User profile
// ---------------------------------------------------------------------------

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly avatarUrl: string | null;
  readonly role: UserRole;
  readonly authProvider: AuthProvider;
  readonly goals: readonly GoalTag[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
