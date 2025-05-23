import axios from "axios";
import { Editorial } from "../types";


const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://0.0.0.0:3000/editorials'  // En Docker
  : 'https://api.tudominio.com';  // En producción

export const getEditorials = async (token: string): Promise<Editorial[]> => {
  const response = await axios.get<Editorial[]>(API_URL,{
      
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Enviar el token si existe
    },
  });
  return response.data;
};

export const getEditorialById = async (id: number): Promise<Editorial> => {
  const response = await axios.get<Editorial>(`${API_URL}/${id}`);
  return response.data;
};

export const createEditorial = async (
  editorial: Omit<Editorial, "id">
): Promise<Editorial> => {
  const response = await axios.post<Editorial>(API_URL, editorial);
  return response.data;
};

export const updateEditorial = async (
  id: number,
  editorial: Partial<Editorial>
): Promise<Editorial> => {
  const response = await axios.put<Editorial>(`${API_URL}/${id}`, editorial);
  return response.data;
};

export const deleteEditorial = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const searchEditorials = async (query: string): Promise<Editorial[]> => {
  const response = await axios.get<Editorial[]>(`${API_URL}/search`, {
    params: { query },
  });
  return response.data;
};
