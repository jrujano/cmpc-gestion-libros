// pages/BookNewPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Book, Genre, Author, Editorial } from '../types/book';
import { createBook, updateBook, getBookById } from '../../api/books';
import BookForm from '../../components/books/BookForm';
import { useAuth } from '../../context/AuthContext';

const BookNewPage = () => {
  const { token } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    // Determinar si estamos en modo edición
    const editMode = location.pathname.includes('/edit');
    console.log(editMode)
    setIsEditing(editMode);
    const loadBook = async () => {
      if (editMode && id) {
        try {
          setIsLoading(true);
          const book = await getBookById(parseInt(id),token);
          setEditingBook(book);
        } catch (error) {
          console.error('Error loading book:', error);
          navigate('/books', { replace: true });
        } finally {
          setIsLoading(false);
        }
      } else {
        setEditingBook({
          title: '',
          ISBN: '',
          description: '',
          price: 0,
          stock: 0,
          publicationDate: new Date().toISOString().split('T')[0],
          genreId: 0,
          editorialId: 0,
          coverImage: '',
          edition: '',
          pages: 0,
          authorIds: []
        });
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, navigate]);


   const handleSubmit = async (formData: FormData) => {
    try {
      setFormLoading(true);
      if (id) {
        await updateBook(parseInt(id), formData, token);
      } else {
        await createBook(formData, token);
      }
      navigate('/books');
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/books'); // Vuelve a la lista de libros
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Editar Libro' : 'Crear Nuevo Libro'}
      </h1>
      
      {editingBook && (
       
        <BookForm
          onSubmit={handleSubmit}
          initialData={editingBook}
          loading={formLoading}
          token={token}
          onCancel={handleCancel} // Pasa la función de cancelar al formulario
        />
      )}
    </div>
  );
};

export default BookNewPage;