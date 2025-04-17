import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { getBooks } from '../../api/books';
import BooksList from '../../components/books/BooksList';
import BookFilters from '../../components/books/BookFilters';
import Pagination from '../../components/common/Pagination';
import { Book, BookFilters as BookFiltersType } from '../../types';
import { useAuth } from '../../context/AuthContext';

const BooksPage = () => {
  const { token } = useAuth();
  const [books, setBooks] =  useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filters, setFilters] = useState<BookFiltersType>({
    // genre: '',
    // editorial: '',
    // author: '',
    // available: undefined,
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const handleDeleteSuccess = () => {
    setRefreshKey(prev => prev + 1); // Esto forzará un nuevo fetch de los libros
    setPage(1); // Opcional: volver a la primera página
  };


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data, total, pages } = await getBooks({
          ...filters,
          search: debouncedSearch,
        }, page, 10, token);
        setBooks(data);
        setTotalPages(pages);
      } catch (err) {
        setError('Failed to fetch books');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters, debouncedSearch, page,refreshKey]);

  const handleFilterChange = (newFilters: Partial<BookFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-gray-800">CMPC-Libros</h1>
        {/* Puedes agregar aquí un botón "Crear libro" por ejemplo */}
      </div>
  
      <BookFilters filters={filters} onChange={handleFilterChange} />
  
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-100 border border-red-200 rounded">
          {error}
        </div>
      ) : (
        <>
          <BooksList books={books}   token={token}  onDeleteSuccess={handleDeleteSuccess}  />
          <div className="mt-6">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BooksPage;