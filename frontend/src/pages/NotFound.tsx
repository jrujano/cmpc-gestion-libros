import { Link } from 'react-router-dom';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <FaceFrownIcon className="h-20 w-20 mx-auto text-gray-400" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">404 - Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-600">
          CMPC - La página que estás buscando no existe o ha sido movida.

        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Regresar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;