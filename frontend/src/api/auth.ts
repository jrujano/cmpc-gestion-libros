import axios from "axios";

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://0.0.0.0:3000/auth'  // En Docker
  : 'https://api.tudominio.com';  // En producción

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return response.data;
};

export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/refresh`, {
    refreshToken,
  });
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUser = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return response.data;
};
