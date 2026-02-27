import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, MapPin, Calendar, Package, ShoppingCart, ArrowLeft } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Vendor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSeller();
    fetchSellerProducts();
  }, [id]);

  const fetchSeller = async () => {
    try {
      const response = await api.get(`/auth/sellers/${id}`);
      setSeller(response.data.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching seller:', err);
      setError(err.response?.data?.message || 'Seller not found');
      setSeller(null);
      setLoading(false);
    }
  };

  const fetchSellerProducts = async (page = 1) => {
    try {
      const response = await api.get(`/auth/sellers/${id}/products?page=${page}&limit=12`);
      setProducts(response.data.data.products);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching seller products:', error);
      setProducts([]);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart');
      })
      .catch((error) => {
        toast.error(error || 'Failed to add to cart');
      });
  };

  const handlePageChange = (newPage) => {
    fetchSellerProducts(newPage);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl md:col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller not found</h2>
        <p className="text-gray-500 mb-6">{error || 'The seller you are looking for does not exist.'}</p>
        <Link to="/" className="text-emerald-600 hover:text-emerald-700">
          Back to Home
        </Link>
      </div>
    );
  }

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&background=10B981&color=fff&size=128`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      {/* Seller Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={seller.avatar || defaultAvatar}
              alt={seller.name}
              className="w-32 h-32 rounded-xl object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{seller.name}</h1>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                <span className="font-medium">{seller.averageRating || 0}</span>
                <span className="text-gray-500">({seller.totalReviews || 0} reviews)</span>
              </div>

              {/* Products */}
              <div className="flex items-center gap-1 text-gray-600">
                <Package size={18} />
                <span>{seller.productCount || 0} Products</span>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar size={18} />
                <span>Joined {new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Bio */}
            {seller.bio && (
              <p className="text-gray-600 mb-4">{seller.bio}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}>
                View Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Products ({seller.productCount || 0})
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'about'
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          About
        </button>
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <div id="products-section">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Image */}
                    <Link to={`/products/${product._id}`}>
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.images?.[0]?.url || 'https://placehold.co/400x400/cccccc/666666?text=No+Image'}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-4">
                      <Link to={`/products/${product._id}`}>
                        <h3 className="font-medium text-gray-900 truncate hover:text-emerald-600">
                          {product.title}
                        </h3>
                      </Link>
                      
                      {/* Rating */}
                      {product.rating?.count > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="text-yellow-400 fill-yellow-400" size={14} />
                          <span className="text-sm text-gray-600">
                            {product.rating.average?.toFixed(1)} ({product.rating.count})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          Rs. {product.price?.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs. {product.originalPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <p className={`text-xs mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </p>

                      {/* Add to Cart */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="w-full mt-3"
                        size="sm"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500">This seller hasn't listed any products yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About {seller.name}</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="font-medium">{seller.productCount || 0}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Customer Reviews</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(seller.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="font-medium">{seller.averageRating || 0} out of 5</span>
                <span className="text-gray-500">({seller.totalReviews || 0} reviews)</span>
              </div>
            </div>

            {seller.bio && (
              <div>
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-gray-700">{seller.bio}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
