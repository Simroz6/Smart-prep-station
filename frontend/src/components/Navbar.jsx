import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, User, Menu, X, LogOut, Package, LayoutDashboard, Store } from 'lucide-react';
import { logout, clearError } from '../../redux/slices/authSlice';
import { getCartCount } from '../../redux/slices/cartSlice';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartCount } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartCount());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">Smart Prep Station</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Products
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/seller/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <Store size={18} />
                Manage Shop
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <LayoutDashboard size={18} />
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-emerald-600 transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <User size={24} />
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-emerald-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link to="/" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
              Products
            </Link>
            <Link to="/cart" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
              Cart ({cartCount})
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block text-emerald-600 font-medium" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
                  Profile
                </Link>
                <Link to="/orders" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
                  My Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/seller/dashboard" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
                    Manage Shop
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block text-gray-700 hover:text-emerald-600" onClick={() => setIsOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block text-red-600">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
