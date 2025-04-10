import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../../api/books';
import { Book } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(Number(id));
        setBook(bookData);
      } catch (err) {
        setError('Failed to load book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <Link 
          to={`/books/${book.id}/edit`} 
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Edit Book
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <p><span className="font-medium">ISBN:</span> {book.ISBN || 'N/A'}</p>
              <p><span className="font-medium">Price:</span> ${book.price.toFixed(2)}</p>
              <p><span className="font-medium">Stock:</span> {book.stock || 0}</p>
              <p><span className="font-medium">Genre:</span> {book.genre?.name || 'N/A'}</p>
              <p><span className="font-medium">Editorial:</span> {book.editorial?.name || 'N/A'}</p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{book.description || 'No description available'}</p>
            </div>

            {book.authors && book.authors.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Authors</h2>
                <ul className="list-disc pl-5">
                  {book.authors.map(author => (
                    <li key={author.id}>{author.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {book.coverImage ? (
              <img 
                src={book.coverImage} 
                alt={`Cover of ${book.title}`}
                className="max-w-full h-auto rounded shadow-md"
              />
            ) : (
              <div className="bg-gray-200 w-full h-64 flex items-center justify-center rounded">
                <span className="text-gray-500">No cover image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;