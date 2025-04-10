/* eslint-disable @typescript-eslint/no-explicit-any */
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BookFilters as BookFiltersType } from '../../types';

interface BookFiltersProps {
  filters: BookFiltersType;
  onChange: (newFilters: Partial<BookFiltersType>) => void;
}

const BookFilters = ({ filters, onChange }: BookFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ search: e.target.value });
  };

  const handleFilterChange = (field: keyof BookFiltersType, value: any) => {
    onChange({ [field]: value });
  };

  const clearFilters = () => {
    onChange({
      search: '',
      genre: '',
      editorial: '',
      author: '',
      available: undefined,
      sortBy: 'title',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Parte superior: búsqueda y filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Buscador */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Buscar libros..."
            value={filters.search}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filtro de género */}
          <div className="relative">
            <select
              value={filters.genre || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value || '')}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos los géneros</option>
              <option value="fiction">Ficción</option>
              <option value="non-fiction">No ficción</option>
              <option value="science">Ciencia</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FunnelIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          </div>
  
          {/* Filtro de disponibilidad */}
          <div className="relative">
            <select
              value={filters.available === undefined ? '' : filters.available.toString()}
              onChange={(e) => handleFilterChange('available', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos</option>
              <option value="true">Disponibles</option>
              <option value="false">No disponibles</option>
            </select>
          </div>
  
          {/* Botón para limpiar filtros */}
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <XMarkIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            Limpiar
          </button>
        </div>
      </div>
  
      {/* Ordenamiento */}
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm text-gray-600">Ordenar por:</label>
          <select
            id="sort-by"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="title">Título</option>
            <option value="price">Precio</option>
            <option value="publicationDate">Fecha de publicación</option>
          </select>
        </div>
  
        <div className="flex items-center gap-2">
          <label htmlFor="sort-order" className="text-sm text-gray-600">Orden:</label>
          <select
            id="sort-order"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>
    </div>
  );
  
};

export default BookFilters;