import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HomeIcon, BookOpenIcon, UserGroupIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
 
  return (
    <div className="bg-gray-800 text-white w-64 p-4 flex flex-col space-y-4">
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Bookstore Admin</h1>
      </div>
      <nav className="mt-6 space-y-1">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `flex items-center px-4 py-3 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          
        </NavLink>
        <NavLink 
          to="/books" 
          className={({ isActive }) => `flex items-center px-4 py-3 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <BookOpenIcon className="h-5 w-5 mr-3" />
          Listados de Libros
          <div className="absolute left-0 mt-1 bg-gray-800 w-full rounded-md shadow-lg">
            
          </div>
        </NavLink>
        <NavLink 
          to="/books/create" 
          className={({ isActive }) => `flex items-center px-4 py-3 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <BookOpenIcon className="h-5 w-5 mr-3" />
          Crear libro
        </NavLink>
        {/* Aca se maneja con los roles  */}
        {user?.role === 'admin' && (
          <>
            <NavLink 
              to="/authors" 
              className={({ isActive }) => `flex items-center px-4 py-3 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <UserGroupIcon className="h-5 w-5 mr-3" />
              Authors
            </NavLink>
            <NavLink 
              to="/editorials" 
              className={({ isActive }) => `flex items-center px-4 py-3 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <BuildingLibraryIcon className="h-5 w-5 mr-3" />
              Editorials
            </NavLink>
          </>
        )}
      </nav>
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <button 
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;