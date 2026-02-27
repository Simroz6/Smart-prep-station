import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but user data isn't loaded yet, show loading
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Admin-specific restriction: If an admin is authenticated but tries to access a non-admin/seller path,
  // redirect them to the admin dashboard, UNLESS it's the profile page.
  if (user?.role === 'admin' && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/seller') && location.pathname !== '/profile') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
