// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'customer' | 'employee')[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirigir al login, guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Usuario autenticado pero sin los roles necesarios
    return <Navigate to="/dashboard" replace />;
    // O podrías mostrar una página de "No autorizado"
    // return <UnauthorizedPage />;
  }

  // Renderizar hijos si existen, de lo contrario renderizar Outlet para rutas anidadas
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;