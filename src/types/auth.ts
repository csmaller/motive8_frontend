import type { UserWithPerson } from './index';

export interface AuthContextType {
  user: UserWithPerson | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}