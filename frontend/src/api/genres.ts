import axios from 'axios';
import { Genre } from '../types';

const API_URL = 'http://localhost:3000/api/genres';

export const getGenres = async (): Promise<Genre[]> => {
  const response = await axios.get<Genre[]>(API_URL);
  return response.data;
};

export const getGenreById = async (id: number): Promise<Genre> => {
  const response = await axios.get<Genre>(`${API_URL}/${id}`);
  return response.data;
};

export const createGenre = async (genre: Omit<Genre, 'id'>): Promise<Genre> => {
  const response = await axios.post<Genre>(API_URL, genre);
  return response.data;
};

export const updateGenre = async (id: number, genre: Partial<Genre>): Promise<Genre> => {
  const response = await axios.put<Genre>(`${API_URL}/${id}`, genre);
  return response.data;
};

export const deleteGenre = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const searchGenres = async (query: string): Promise<Genre[]> => {
  const response = await axios.get<Genre[]>(`${API_URL}/search`, {
    params: { query }
  });
  return response.data;
};