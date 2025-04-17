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

export const getBookById = async (id: number, token:string): Promise<Book> => {
  const response = await axios.get<Book>(`${API_URL}/${id}`,{
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Enviar el token si existe
    },
  });
  return response.data;
};

export const createBook = async (book: FormData, token: string): Promise<Book> => {
  const response = await axios.post<Book>(API_URL, book, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "", 
    },
  });
  return response.data;
};



export const updateBook = async (id: number, book: FormData, token: string): Promise<Book> => {
  const response = await axios.put<Book>(`${API_URL}/${id}`, book, {
    headers: {
           Authorization: token ? `Bearer ${token}` : "", 
    },
  });
  return response.data;
};

export const deleteBook = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`,{
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

export const exportBooksToCSV = async (token: string): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/export`, {
    responseType: "blob", // Important for file downloads
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
};
