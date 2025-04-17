import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { EyeIcon, PencilSquareIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal'; // Asumo que tienes un componente Modal básico

import { deleteBook, exportBooksToCSV } from '../../api/books';
import { saveAs } from 'file-saver'; // You'll need to install this package
import { useState } from 'react';
interface BooksListProps {
  books: Book[];
  token: string; // Add token en props
  onDeleteSuccess: () => void; // Callback para actualizar la lista después de eliminar
}

const BooksList = ({ books, token , onDeleteSuccess}: BooksListProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportCSV = async () => {
    try {
      const blob = await exportBooksToCSV(token);
      saveAs(blob, 'books_export.csv');
    } catch (error) {
      console.error('Error exporting books:', error);
      // You might want to add error handling/toast notification here
    }
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteBook(bookToDelete.id, token);
      onDeleteSuccess(); // Llama a la función para actualizar la lista
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting book:', error);
      // Puedes agregar un toast de error aquí
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Books</h3>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
          Exportar todo
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Rest of your table code remains the same */}
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titulo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Autor(es)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Genere
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {book.coverImage && (
                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                      <img className="h-10 w-10 rounded" src={book.coverImage} alt={book.title} />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.ISBN}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {book.authors?.map(a => a.name).join(', ') || 'Unknown'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {book.genre?.name || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${book.price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.stock && book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {book.stock || 0} {book.stock === 1 ? 'unidad' : 'unidades'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/books/${book.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/books/${book.id}/edit`}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Edit"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                  <button
                      onClick={() => handleDeleteClick(book)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     {/* Modal de Confirmación de Eliminación */}
     <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <div className="mt-4">
          <p className="text-gray-700">
            ¿Estás seguro que deseas eliminar el libro <strong>{bookToDelete?.title}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </Modal></>
  );
};

export default BooksList;