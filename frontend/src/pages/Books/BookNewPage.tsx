// components/BookPage.tsx
import React, { useState, useEffect } from 'react';
import { Book, Genre, Author, Editorial } from '../types/book';
// import BookTable from './BookTable';
// import BookForm from './BookForm';
import  BookForm  from "../../components/books/BookForm";


import { useAuth } from '../../context/AuthContext';
const BookNewPage = () => {
  const { token } = useAuth();
   const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (book: Book) => {
    try {
      if (book.id) {
        await updateBook(book.id, book);
      } else {
        await createBook(book);
      }
      loadData();
      setEditingBook(null);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      loadData();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Management</h1>
      
      <button 
        onClick={() => setEditingBook({
          title: '',
          ISBN: '',
          description: '',
          price: 0,
          stock: 0,
          publicationDate: new Date().toISOString().split('T')[0],
          genreId: genres[0]?.id || 0,
          editorialId: editorials[0]?.id || 0,
          coverImage: '',
          edition: '',
          pages: 0,
          authorIds: []
        })}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Book
      </button>

      {editingBook && (
        // <BookForm
        //   book={editingBook}
        //   genres={genres}
        //   authors={authors}
        //   editorials={editorials}
        //   onSave={handleSave}
        //   onCancel={() => setEditingBook(null)}
        // />
        <BookForm></BookForm>
      )}

      <h2>Detalle</h2>
    </div>
  );
};

export default BookNewPage;