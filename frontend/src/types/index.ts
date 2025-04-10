export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer" | "employee";
  isActive: boolean;
}

export interface Book {
  id: number;
  title: string;
  ISBN?: string;
  description?: string;
  price: number;
  stock?: number;
  publicationDate?: string;
  genreId?: number;
  editorialId?: number;
  coverImage?: string;
  edition?: string;
  pages?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  genre?: Genre;
  editorial?: Editorial;
  authors?: Author[];
}

export interface Author {
  id: number;
  name: string;
  biography?: string;
  nationality?: string;
  birthDate?: string;
  deathDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Editorial {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  foundationDate?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookFilters {
  genre?: string;
  editorial?: string;
  author?: string;
  available?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: User; // Opcional, dependiendo de tu backend
}
