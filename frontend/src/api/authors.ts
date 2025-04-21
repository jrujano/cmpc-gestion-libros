import axios from "axios";
import { Author } from "../types";

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://0.0.0.0:3000/authors'  // En Docker
  : 'https://api.tudominio.com';  // En producción
export const getAuthors = async (token: string): Promise<Author[]> => {

   const response = await axios.get<Author[]>(API_URL, {
      
      headers: {
        Authorization: token ? `Bearer ${token}` : "", // Enviar el token si existe
      },
    });
  return response.data;

};

export const getAuthorById = async (id: number): Promise<Author> => {
  const response = await axios.get<Author>(`${API_URL}/${id}`);
  return response.data;
};

export const createAuthor = async (
  author: Omit<Author, "id">
): Promise<Author> => {
  const response = await axios.post<Author>(API_URL, author);
  return response.data;
};

export const updateAuthor = async (
  id: number,
  author: Partial<Author>
): Promise<Author> => {
  const response = await axios.put<Author>(`${API_URL}/${id}`, author);
  return response.data;
};

export const deleteAuthor = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const searchAuthors = async (query: string): Promise<Author[]> => {
  const response = await axios.get<Author[]>(`${API_URL}/search`, {
    params: { query },
  });
  return response.data;
};
