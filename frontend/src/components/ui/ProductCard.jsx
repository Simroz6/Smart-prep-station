import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Share2, Link as Link2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, buyNow } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const imageUrl = product.images?.[0]?.url || 'https://placehold.co/300x300/cccccc/666666?text=No+Image';
  const isInWishlist = wishlist?.items?.some((item) => item.product?._id === product._id) || false;

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/products/${product._id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Product link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
      .unwrap()
      .then(() => toast.success('Added to cart'))
      .catch((error) => toast.error(error || 'Failed to add to cart'));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    // For simplicity from the grid, we pick the first options if they exist
    const selectedVariants = product.variants?.map(v => ({
      name: v.name,
      option: v.options[0]
    })) || [];

    dispatch(buyNow({ productId: product._id, quantity: 1, selectedVariants }))
      .unwrap()
      .then(() => {
        navigate('/checkout');
      })
      .catch((error) => {
        toast.error(error || 'Failed to process checkout');
      });
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => toast.success('Removed from wishlist'))
        .catch((error) => toast.error(error || 'Failed to remove from wishlist'));
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => toast.success('Added to wishlist'))
        .catch((error) => toast.error(error || 'Failed to add to wishlist'));
    }
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/products/${product._id}`}>
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          <Link
            to={`/products/${product._id}`}
            className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:bg-emerald-600 hover:text-white transition-colors"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={handleShare}
            className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-colors"
            title="Copy Link"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="bg-white text-emerald-600 py-2 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors border border-emerald-600"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-emerald-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-emerald-600 font-medium mb-1">
          {product.category?.name || 'Uncategorized'}
        </p>

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating?.count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.round(product.rating.average)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            Rs. {product.price?.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              Rs. {product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Visible Product Link */}
        <div 
          onClick={handleShare}
          className="mt-3 bg-gray-50 p-2 rounded border border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group/link"
        >
          <Link2 size={14} className="text-gray-400 group-hover/link:text-emerald-600" />
          <span className="text-[10px] text-gray-500 truncate font-mono flex-1 group-hover/link:text-emerald-700">
            {`${window.location.origin}/products/${product._id}`}
          </span>
          <button className="text-[10px] text-emerald-600 font-bold opacity-0 group-hover/link:opacity-100 transition-opacity">
            COPY
          </button>
        </div>

        {/* Deals Visibility */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          {product.category?.name === 'Bundles' ? (
            <div className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded flex items-center justify-between">
              <span>BEST VALUE DEAL</span>
              <Link to="/products?category=bundles" className="underline hover:text-orange-800">
                View All Bundles
              </Link>
            </div>
          ) : (
            <Link 
              to="/products?category=bundles"
              className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center justify-between group/deal"
            >
              <span>Save with Bundle Deals!</span>
              <span className="bg-emerald-50 px-2 py-0.5 rounded group-hover/deal:bg-emerald-100 transition-colors">
                View
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
