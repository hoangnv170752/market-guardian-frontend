const API_BASE_URL = `${import.meta.env.VITE_BE_BASE_URL}/api`;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailLower: string;
  role: string;
  profilePicture: string | null;
  bio: string;
  location: string;
  isVerified: boolean;
  status: string;
  description: string | null;
  loginAttempts: number;
  lastLoginAttempt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  errors: any[];
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture?: File | null;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data?: any;
  errors: any[];
}

export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      const message = errorData.message || (errorData.errors && errorData.errors[0]) || 'Login failed';
      throw new Error(message);
    } catch (e: any) {
      // If parsing fails or we just caught the error we threw above
      if (e.message !== 'Login failed' && e.message) {
        throw e;
      }
      throw new Error('Login failed');
    }
  }

  return response.json();
};

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  errors: any[];
}

export const refreshTokenApi = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
};

export interface VerifyEmailRequest {
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: any;
  errors: any[];
}

export const signUpApi = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('confirmPassword', data.confirmPassword);
  if (data.profilePicture) {
    formData.append('profilePicture', data.profilePicture);
  }

  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Sign up failed');
  }

  return response.json();
};

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
  errors: any[];
}

export const verifyEmailApi = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  const response = await fetch(`${API_BASE_URL}/verify-email`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Email verification failed');
  }

  return response.json();
};

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
  errors: any[];
}

export const forgotPasswordApi = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send reset email');
  }

  return response.json();
};

export const resetPasswordApi = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to reset password');
  }

  return response.json();
};

// Demo API Types
export interface DemoSessionResponse {
  sessionId: string;
  message: string;
}

export interface Candle {
  symbol: string;
  timeframe: string;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  trades: number;
  takerBuyVolume: number;
  takerBuyQuoteVolume: number;
  isClosed: boolean;
  scenario: string;
}

export interface MarketEventResponse {
  scenario: string;
  candle: Candle;
  riskDetected: boolean;
  state: string;
  transitionType: string;
  message: string | null;
  signals: any[];
  whatHappened: string | null;
  metrics: any | null;
  sessionId: string;
}

// Start demo session
export const startDemoSession = async (): Promise<DemoSessionResponse> => {
  const response = await fetch(`${API_BASE_URL}/demo/start`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to start demo session');
  }

  return response.json();
};

// Stream market events
export const getMarketEvent = async (
  sessionId: string,
  scenario: string = 'normal',
  pair: string = 'BTC/USDT',
  timeframe: string = '1s',
  userContext: string = 'viewing_chart'
): Promise<MarketEventResponse> => {
  const params = new URLSearchParams({
    sessionId,
    scenario,
    pair,
    timeframe,
    userContext,
  });

  const response = await fetch(`${API_BASE_URL}/demo/stream?${params.toString()}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch market event');
  }

  return response.json();
};

export interface MarketAnalysisRequest {
  sessionId?: string | undefined;
  userContext?: string | undefined;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp?: number;
}

export interface MarketAnalysisResponse {
  riskDetected: boolean;
  state: string;
  transitionType: string;
  message: string | null;
  signals: string[];
  whatHappened: string | null;
  metrics: any;
  sessionId: string | null;
}

export const analyzeMarketEvent = async (data: MarketAnalysisRequest): Promise<MarketAnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/market/event`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze market event');
  }

  return response.json();
};

// Market config fallback
export interface MarketConfigResponse {
  availablePairs: string[];
  availableTimeframes: string[];
  availableScenarios: string[];
}

export const fetchMarketConfig = async (): Promise<MarketConfigResponse> => {
  const response = await fetch(`${API_BASE_URL}/market/config`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch market config');
  }

  return response.json();
};

export interface FetchMarketCandlesParams {
  pair?: string;
  timeframe?: '1s' | '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | string;
  sessionId?: string;
  from?: string | number;
  to?: string | number;
  limit?: number;
}

interface MarketCandleApiItem {
  id: number;
  sessionId: string;
  symbol: string;
  timeframe: string;
  openTime: string | number;
  closeTime: string | number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface MarketCandlesApiResponse {
  success: boolean;
  message: string;
  data?: {
    candles: MarketCandleApiItem[];
    count: number;
    filters: {
      pair: string | null;
      timeframe: string | null;
      sessionId: string | null;
      from: string | number | null;
      to: string | number | null;
      limit: number;
    };
  };
  errors: any[];
}

export interface FetchMarketCandlesResult {
  candles: Candle[];
  count: number;
  filters: {
    pair: string | null;
    timeframe: string | null;
    sessionId: string | null;
    from: string | number | null;
    to: string | number | null;
    limit: number;
  } | null;
  message: string;
}

const parseTimeToMs = (value: string | number): number => {
  if (typeof value === 'number') return value;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapMarketCandleToCandle = (c: MarketCandleApiItem): Candle => ({
  symbol: c.symbol,
  timeframe: c.timeframe,
  openTime: parseTimeToMs(c.openTime),
  closeTime: parseTimeToMs(c.closeTime),
  open: Number(c.open),
  high: Number(c.high),
  low: Number(c.low),
  close: Number(c.close),
  volume: Number(c.volume),
  quoteVolume: 0,
  trades: 0,
  takerBuyVolume: 0,
  takerBuyQuoteVolume: 0,
  isClosed: true,
  scenario: 'normal',
});

export const fetchMarketCandles = async (params: FetchMarketCandlesParams = {}): Promise<FetchMarketCandlesResult> => {
  const searchParams = new URLSearchParams();
  if (params.pair) searchParams.set('pair', params.pair);
  if (params.timeframe) searchParams.set('timeframe', params.timeframe);
  if (params.sessionId) searchParams.set('sessionId', params.sessionId);
  if (params.from !== undefined) searchParams.set('from', String(params.from));
  if (params.to !== undefined) searchParams.set('to', String(params.to));
  if (params.limit !== undefined) {
    const safeLimit = Math.max(1, Math.min(1000, Number(params.limit) || 200));
    searchParams.set('limit', String(safeLimit));
  }

  const response = await fetch(`${API_BASE_URL}/market/candles?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  let payload: MarketCandlesApiResponse | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to fetch candles');
  }
  if (!payload?.success) {
    throw new Error(payload?.message || 'Failed to fetch candles');
  }

  const candles = Array.isArray(payload.data?.candles)
    ? payload.data!.candles.map(mapMarketCandleToCandle)
    : [];

  return {
    candles,
    count: payload.data?.count || candles.length,
    filters: payload.data?.filters || null,
    message: payload.message,
  };
};

// Full Market Analysis API
export interface CandleHistoryItem {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FullAnalysisRequest {
  candleHistory: CandleHistoryItem[];
  currentAlert?: {
    riskDetected?: boolean;
    state?: string;
    signals?: string[];
    metrics?: any;
  };
  userContext?: string;
}

export interface FullAnalysisResponse {
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';
  summary: string;
  signals: string[];
  metrics: {
    volumeRatio?: number;
    rangePercent?: number;
    priceChange24h?: number;
    trades?: number;
    [key: string]: any;
  };
  trends?: {
    shortTerm?: string;
    mediumTerm?: string;
    longTerm?: string;
  };
  supportResistance?: {
    support?: number[];
    resistance?: number[];
  };
  recommendation?: string;
}

export const getFullMarketAnalysis = async (data: FullAnalysisRequest): Promise<FullAnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/analysis/full`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to get full market analysis');
  }

  return response.json();
};
