interface SupabaseAuthResponse {
  user: User | null;
  session: Session | null;
  weakPassword?: WeakPassword | null;
}

interface Session {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: User;
}

interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  created_at: string;
  is_anonymous: boolean;
  last_sign_in_at: string;
  updated_at: string;
  user_metadata: any;
  app_metadata: any;
}

interface WeakPassword {
  message: string;
  minimumRequiredPasswordStrength: number;
}

interface Identity {}

interface UserMetadata {}

interface AppMetadata {
  provider: string;
  providers: string[];
}
