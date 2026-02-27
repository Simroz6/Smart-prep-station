import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Products from '../pages/Products';
import ShopPage from '../pages/ShopPage';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Profile from '../pages/Profile';
import SellerDashboard from '../pages/SellerDashboard';
import AddProduct from '../pages/AddProduct';
import Wishlist from '../pages/Wishlist';
import ProductReview from '../pages/ProductReview';
import AdminDashboard from '../pages/AdminDashboard';

export default function AppRoutes() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ShopPage />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/review" element={<ProtectedRoute><ProductReview /></ProtectedRoute>} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/cart" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/wishlist" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/checkout" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/orders" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/orders/:id" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/profile" element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Seller Routes */}
        <Route path="/seller" element={<MainLayout />}>
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="products/new"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="products/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Go back home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}
