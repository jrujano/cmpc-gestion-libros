import axios from "axios";
import { Editorial } from "../types";

const API_URL = "http://localhost:3000/api/editorials";

export const getEditorials = async (): Promise<Editorial[]> => {
  const response = await axios.get<Editorial[]>(API_URL);
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
