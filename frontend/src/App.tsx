// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import Dashboard from './pages/Dashboard';
import BooksPage from './pages/Books/BooksPage';
import BookDetailPage from './pages/Books/BookDetailPage';
import Layout from './components/layout';
import NotFoundPage from './pages/NotFound';
import AdminPanel from './pages/AdminPanel';
import BookNewPage from './pages/Books/BookNewPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          
          {/* Rutas protegidas */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* <Route element={<ProtectedRoute allowedRoles={['admin', 'employee']} />}> */}
            <Route element={<ProtectedRoute  />}>

              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/create" element={<BookNewPage />} />
              <Route path="/books/:id/edit" element={<BookNewPage />} />

              <Route path="/books/:id" element={<BookDetailPage />} />
              
            </Route>
            
            {/* Solo para admin */}
            {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}> */}
            <Route element={<ProtectedRoute />}>

              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;