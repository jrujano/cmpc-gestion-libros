import axios from "axios";
import { Book, BookFilters, PaginatedResponse } from "../types";

const API_URL = "http://localhost:3000/books";

export const getBooks = async (
  filters: BookFilters,
  page: number = 1,
  limit: number = 10,
  token: string
): Promise<PaginatedResponse<Book>> => {
  //  Obtener el token del localStorage
  // const token = localStorage.getItem("token");

  const response = await axios.get<PaginatedResponse<Book>>(API_URL, {
    params: { ...filters, page, limit },
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Enviar el token si existe
    },
  });
  return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
  const response = await axios.get<Book>(`${API_URL}/${id}`);
  return response.data;
};

export const createBook = async (book: FormData): Promise<Book> => {
  const response = await axios.post<Book>(API_URL, book, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBook = async (id: number, book: FormData): Promise<Book> => {
  const response = await axios.put<Book>(`${API_URL}/${id}`, book, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
