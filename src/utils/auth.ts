import { User } from '../services/api';

const AUTH_KEYS = {
  EMAIL: 'auth_email',
  PASSWORD: 'auth_password',
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
} as const;

export const saveAuthData = (
  email: string,
  password: string,
  accessToken: string,
  refreshToken: string,
  user: User
) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEYS.EMAIL, email);
    localStorage.setItem(AUTH_KEYS.PASSWORD, password);
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
  }
  return null;
};

// Backward compatibility
export const getAuthToken = getAccessToken;

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

export const updateTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEYS.EMAIL);
    localStorage.removeItem(AUTH_KEYS.PASSWORD);
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
