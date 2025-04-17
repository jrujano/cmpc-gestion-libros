import { useForm } from 'react-hook-form';
import { Author, Book, Editorial, Genre } from '../../types';
import { useEffect, useState } from 'react';
import { getAuthors } from '../../api/authors';
import { getEditorials } from '../../api/editorials';
import { getGenres } from '../../api/genres';
import LoadingSpinner from '../common/LoadingSpinner';

interface BookFormProps {
  onSubmit: (data: Book) => void;
  initialData?: Book;
  loading: boolean;
  token: string;
  onCancel?: () => void;
}

const BookForm = ({ onSubmit, initialData, loading, token , onCancel}: BookFormProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    setValue,
    watch
  } = useForm<Book>({
    defaultValues: {
      genreId: initialData?.genreId || undefined,
      editorialId: initialData?.editorialId || undefined
    }
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);
  const [coverImageBase64, setCoverImageBase64] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Observar cambios en genreId y editorialId para validación
  const genreId = watch('genreId');
  const editorialId = watch('editorialId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError(null);
        
        const [authorsRes, editorialsRes, genresRes] = await Promise.all([
          getAuthors(token),
          getEditorials(token),
          getGenres(token),
        ]);
        
        setAuthors(authorsRes);
        setEditorials(editorialsRes);
        setGenres(genresRes);
        
        if (initialData) {
          reset({
            ...initialData,
            genreId: initialData.genreId || undefined,
            editorialId: initialData.editorialId || undefined
          });
          setSelectedAuthors(initialData.authors?.map(a => a.id) || []);
          if (initialData.coverImage) {
            setCoverImageBase64(initialData.coverImage);
          }
        }
      } catch (err) {
        setError('Error al cargar los datos del formulario. Por favor intente nuevamente.');
        console.error('Error loading form data:', err);
      } finally {
        setLoadingData(false);
      }
    };
  
    fetchData();
  }, [initialData, reset, token]);
  
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }

      const compressedFile = await compressImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImageBase64(event.target.result as string);
        }
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const onSubmitHandler = (data: Book) => {
    if (!genreId || !editorialId) {
      alert('Por favor seleccione un género y una editorial');
      return;
    }

    const bookData: Book = {
      ...data,
      authorIds: selectedAuthors,
      coverImage: coverImageBase64 || undefined,
      price: Number(data.price),
      stock: Number(data.stock),
      pages: Number(data.pages),
      genreId: Number(genreId),
      editorialId: Number(editorialId)
    };
    
    onSubmit(bookData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título*</label>
        <input
          {...register('title', { required: 'El título es obligatorio' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ISBN</label>
        <input
          {...register('ISBN', { required: 'El ISBN es obligatorio' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.ISBN && <p className="text-red-500 text-sm mt-1">{errors.ISBN.message}</p>}
        
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio*</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { 
              required: 'El precio es obligatorio', 
              min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            {...register('stock', { 
              min: { value: 0, message: 'El stock debe ser mayor o igual a 0' }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Género*</label>
          <select
            {...register('genreId', { required: 'Seleccione un género' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              errors.genreId ? 'border-red-500' : ''
            }`}
          >
            <option value="">Seleccione un género</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          {errors.genreId && <p className="text-red-500 text-sm mt-1">{errors.genreId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Editorial*</label>
          <select
            {...register('editorialId', { required: 'Seleccione una editorial' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              errors.editorialId ? 'border-red-500' : ''
            }`}
          >
            <option value="">Seleccione una editorial</option>
            {editorials.data.map(editorial => (
              <option key={editorial.id} value={editorial.id}>{editorial.name}</option>
            ))}
          </select>
          {errors.editorialId && <p className="text-red-500 text-sm mt-1">{errors.editorialId.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Autores</label>
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
        <label className="block text-sm font-medium text-gray-700">Portada</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {coverImageBase64 && (
          <div className="mt-2">
            <img 
              src={coverImageBase64} 
              alt="Vista previa" 
              className="h-40 object-contain border rounded"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      
    </form>
  );
};

export default BookForm;