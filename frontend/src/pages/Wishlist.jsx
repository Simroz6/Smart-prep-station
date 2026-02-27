import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { getWishlist, removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated, navigate]);

  const items = wishlist?.items || [];

  const handleRemoveItem = (productId) => {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .then(() => toast.success('Removed from wishlist'))
      .catch((error) => toast.error(error || 'Failed to remove'));
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      dispatch(clearWishlist())
        .unwrap()
        .then(() => toast.success('Wishlist cleared'))
        .catch((error) => toast.error(error || 'Failed to clear'));
    }
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      dispatch(addToCart({ productId: item.product?._id, quantity: 1 }));
    });
    toast.success('All items added to cart');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleClearWishlist}>
                Clear All
              </Button>
              <Button onClick={handleAddAllToCart}>
                <ShoppingBag size={18} className="mr-2" />
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {/* Wishlist Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Save your favorite items to your wishlist and they'll appear here. Start shopping to add items!
            </p>
            <Link to="/products">
              <Button size="lg">
                Start Shopping
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.product?._id || item._id} className="relative group">
                <ProductCard product={item.product} />
                <button
                  onClick={() => handleRemoveItem(item.product?._id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recently Viewed Section */}
        {items.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You may also like</h2>
              <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Placeholder for recommended products */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
