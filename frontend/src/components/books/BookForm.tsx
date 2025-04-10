import { useForm } from 'react-hook-form';
import { Author, Book, Editorial, Genre } from '../../types';
import { useEffect, useState } from 'react';
import { getAuthors } from '../../api/authors';
import { getEditorials } from '../../api/editorials';
import { getGenres } from '../../api/genres';
import LoadingSpinner from '../common/LoadingSpinner';
interface BookFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Book;
  loading: boolean;
}

const BookForm = ({ onSubmit, initialData, loading }: BookFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<Book>();
  const [authors, setAuthors] = useState<Author[]>([]);

  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [authorsRes, editorialsRes, genresRes] = await Promise.all([
        getAuthors(),
        getEditorials(),
        getGenres(),
      ]);
      setAuthors(authorsRes);
      setEditorials(editorialsRes);
      setGenres(genresRes);
    };
    fetchData();

    if (initialData) {
      reset(initialData);
      setSelectedAuthors(initialData.authors?.map(a => a.id) || []);
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError(null);
        
        const [authorsRes, editorialsRes, genresRes] = await Promise.all([
          getAuthors(),
          getEditorials(),
          getGenres(),
        ]);
        
        setAuthors(authorsRes);
        setEditorials(editorialsRes);
        setGenres(genresRes);
        
        if (initialData) {
          reset(initialData);
          setSelectedAuthors(initialData.authors?.map(a => a.id) || []);
        }
      } catch (err) {
        setError('Failed to load form data. Please try again later.');
        console.error('Error loading form data:', err);
      } finally {
        setLoadingData(false);
      }
    };
  
    fetchData();
  }, [initialData, reset]);
  
  if (loadingData) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  const handleAuthorSelection = (authorId: number) => {
    setSelectedAuthors(prev => 
      prev.includes(authorId) 
        ? prev.filter(id => id !== authorId) 
        : [...prev, authorId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = (data: Book) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('ISBN', data.ISBN || '');
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock?.toString() || '0');
    formData.append('publicationDate', data.publicationDate || '');
    formData.append('genreId', data.genreId?.toString() || '');
    formData.append('editorialId', data.editorialId?.toString() || '');
    formData.append('edition', data.edition || '');
    formData.append('pages', data.pages?.toString() || '');
    selectedAuthors.forEach(authorId => {
      formData.append('authorIds', authorId.toString());
    });
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ISBN</label>
        <input
          {...register('ISBN')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: 'Price is required', min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            {...register('stock', { min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <select
            {...register('genreId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select a genre</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Editorial</label>
          <select
            {...register('editorialId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select an editorial</option>
            {editorials.map(editorial => (
              <option key={editorial.id} value={editorial.id}>{editorial.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Authors</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {authors.map(author => (
            <div key={author.id} className="flex items-center">
              <input
                type="checkbox"
                id={`author-${author.id}`}
                checked={selectedAuthors.includes(author.id)}
                onChange={() => handleAuthorSelection(author.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`author-${author.id}`} className="ml-2 block text-sm text-gray-900">
                {author.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Book'}
      </button>
    </form>
  );
};

export default BookForm;