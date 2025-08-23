// src/lib/api.ts
import axios from "axios";
import CryptoJS from "crypto-js";

axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

interface Request {
  method: string;
  url: string;
  data?: any;
  params?: any;
}

const secureStorage = {
  secretKey: "your-secret-encryption-key-replace-in-production",

  setItem: (key: string, data: any): void => {
    try {
      const jsonData = JSON.stringify(data);
      const encryptedData = CryptoJS.AES.encrypt(
          jsonData,
          secureStorage.secretKey
      ).toString();
      localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error(`Error encrypting/storing data for key ${key}:`, error);
    }
  },

  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const encryptedData = localStorage.getItem(key);
      if (!encryptedData) return defaultValue;

      const decryptedBytes = CryptoJS.AES.decrypt(
          encryptedData,
          secureStorage.secretKey
      );
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) return defaultValue;

      return JSON.parse(decryptedText);
    } catch (error) {
      console.error(`Error retrieving/decrypting data for key ${key}:`, error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};

export const getAuthToken = () => {
  return secureStorage.getItem<string>("auth_token");
};

export const setAuthToken = (token: string) => {
  secureStorage.setItem("auth_token", token);
};

export const getRefreshToken = () => {
  return secureStorage.getItem<string>("refresh_token");
};

export const setRefreshToken = (token: string) => {
  secureStorage.setItem("refresh_token", token);
};

export const removeTokens = () => {
  secureStorage.removeItem("auth_token");
  secureStorage.removeItem("refresh_token");
};

export const getUser = () => {
  return secureStorage.getItem<{ id: number; email: string; role: string }>(
      "user"
  );
};

export const setUser = (user: { id: number; email: string; role: string }) => {
  secureStorage.setItem("user", user);
};

export const removeUser = () => {
  secureStorage.removeItem("user");
};

export const request = ({ method, url, data, params }: Request) => {
  let headers = {};
  const token = getAuthToken();
  if (token !== null && token !== "null") {
    headers = { Authorization: `Bearer ${token}` };
  }
  return axios({
    method,
    headers,
    url,
    data,
    params,
    withCredentials: true,
  });
};

// Add axios interceptor for token refresh
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const response = await axios.post('/api/auth/refresh', { refreshToken });
            const newAccessToken = response.data.data.accessToken;

            setAuthToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axios(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          removeTokens();
          removeUser();
          window.location.href = '/sign-in';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
);

export interface TotpSetupResponse {
  secret: string;
  qrCodeDataUri: string;
  backupCodes?: string[];
}

export interface TotpStatusResponse {
  enabled: boolean;
  verified: boolean;
}

// Payment interfaces
export interface PaymentDTO {
  id: number;
  reservationId: number;
  userEmail: string;
  carDetails: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentDetails: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDTO {
  reservationId: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  paymentDetails: string;
}

export interface InitiatePaymentResponse {
  payment: PaymentDTO;
  paymentUrl?: string;
  clientSecret?: string;
  orderId?: string;
}

// Reservation interfaces
export interface Reservation {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

// Reservation Service Functions
export const reservationService = {
  cancelReservation: (reservationId: number) =>
      request({
        method: "PATCH",
        url: `/api/reservations/${reservationId}/cancel`
      }),

  getUserReservations: () =>
      request({
        method: "GET",
        url: "/api/reservations/my-reservations"
      }),

  createReservation: (data: CreateReservationData) =>
      request({
        method: "POST",
        url: "/api/reservations",
        data
      }),

  getReservationById: (id: number) =>
      request({
        method: "GET",
        url: `/api/reservations/${id}`
      }),

  updateReservationStatus: (id: number, status: string) =>
      request({
        method: "PATCH",
        url: `/api/reservations/${id}/status`,
        data: { status }
      }),
};

export const auth = {
  signIn: async (credentials: { email: string; password: string }) => {
    const response = await request({
      method: "POST",
      url: "/api/auth/signin",
      data: credentials,
    });

    if (response.data.message === "TOTP_REQUIRED") {
      return {
        requiresTotp: true,
        totpSetupRequired: response.data.data.totpSetupRequired || false,
        email: credentials.email,
      };
    }

    setAuthToken(response.data.data.token);
    setUser({
      id: response.data.data.id,
      email: response.data.data.email,
      role: response.data.data.role,
    });
    return { requiresTotp: false, user: response.data.data };
  },

  signInWithTotp: async (credentials: {
    email: string;
    password: string;
    totpCode: string;
  }) => {
    const response = await request({
      method: "POST",
      url: "/api/auth/signin-totp",
      data: credentials,
    });

    setAuthToken(response.data.data.token);
    setUser({
      id: response.data.data.id,
      email: response.data.data.email,
      role: response.data.data.role,
    });
    return response.data.data;
  },

  signUp: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    const response = await request({
      method: "POST",
      url: "/api/auth/signup",
      data: userData,
    });
    return response.data.data;
  },

  signOut: async () => {
    removeTokens();
    removeUser();
  },

  forgotPassword: async (email: string) => {
    const response = await request({
      method: "POST",
      url: "/api/auth/forgot-password",
      data: { email },
    });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await request({
      method: "POST",
      url: "/api/auth/reset-password",
      data: { token, newPassword },
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    return response.data.data;
  }
};

export const totp = {
  setup: async (email: string): Promise<TotpSetupResponse> => {
    const response = await request({
      method: "POST",
      url: "/api/auth/totp/setup",
      data: { email },
    });
    return response.data.data;
  },

  verify: async (email: string, code: string): Promise<boolean> => {
    const response = await request({
      method: "POST",
      url: "/api/auth/totp/verify",
      data: { email, code },
    });
    return response.data.data;
  },

  disable: async (email: string, code: string): Promise<boolean> => {
    const response = await request({
      method: "POST",
      url: "/api/totp/disable",
      data: { email, code },
    });
    return response.data.data;
  },

  status: async (email: string): Promise<TotpStatusResponse> => {
    const response = await request({
      method: "GET",
      url: "/api/totp/status",
      params: { email },
    });
    return response.data.data;
  },
};

// Payment functions
export const payments = {
  initiate: async (reservationId: number): Promise<InitiatePaymentResponse> => {
    const response = await request({
      method: "POST",
      url: `/api/payments/initiate?reservationId=${reservationId}`,
    });
    return response.data.data;
  },

  create: async (paymentData: CreatePaymentDTO): Promise<PaymentDTO> => {
    const response = await request({
      method: "POST",
      url: "/api/payments",
      data: paymentData,
    });
    return response.data.data;
  },

  getById: async (paymentId: number): Promise<PaymentDTO> => {
    const response = await request({
      method: "GET",
      url: `/api/payments/${paymentId}`,
    });
    return response.data.data;
  },

  getByReservationId: async (reservationId: number): Promise<PaymentDTO> => {
    const response = await request({
      method: "GET",
      url: `/api/payments/reservation/${reservationId}`,
    });
    return response.data.data;
  },

  updateStatus: async (paymentId: number, status: string): Promise<PaymentDTO> => {
    const response = await request({
      method: "PATCH",
      url: `/api/payments/${paymentId}/status?status=${status}`,
    });
    return response.data.data;
  },

  getAll: async (): Promise<PaymentDTO[]> => {
    const response = await request({
      method: "GET",
      url: "/api/payments",
    });
    return response.data.data;
  }
};

// Legacy reservation functions (for backward compatibility)
export const reservations = {
  getById: async (reservationId: number): Promise<any> => {
    const response = await request({
      method: "GET",
      url: `/api/reservations/${reservationId}`,
    });
    return response.data.data;
  },

  create: async (reservationData: any): Promise<any> => {
    const response = await request({
      method: "POST",
      url: "/api/reservations",
      data: reservationData,
    });
    return response.data.data;
  },
};

export default axios;