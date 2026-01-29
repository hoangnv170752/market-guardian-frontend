import { User } from '../services/api';

const AUTH_KEYS = {
  EMAIL: 'auth_email',
  PASSWORD: 'auth_password',
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const saveAuthData = (email: string, password: string, token: string, user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEYS.EMAIL, email);
    localStorage.setItem(AUTH_KEYS.PASSWORD, password);
    localStorage.setItem(AUTH_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEYS.TOKEN);
  }
  return null;
};

export const getAuthEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEYS.EMAIL);
  }
  return null;
};

export const getAuthPassword = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEYS.PASSWORD);
  }
  return null;
};

export const getAuthUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(AUTH_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEYS.EMAIL);
    localStorage.removeItem(AUTH_KEYS.PASSWORD);
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
