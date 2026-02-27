import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
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

  const imageUrl = product.images?.[0]?.url || 'https://placehold.co/300x300/cccccc/666666?text=No+Image';
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-emerald-600 font-medium mb-1">
            {product.category?.name || 'Uncategorized'}
          </p>

          {/* Title */}
          <h3 className="text-gray-800 font-medium text-sm line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating.average?.toFixed(1) || '0'}
              </span>
              <span className="text-xs text-gray-400">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs font-medium text-red-500">
                -{discount}%
              </span>
            )}
          </div>

          {/* Seller */}
          {product.seller && (
            <p className="text-xs text-gray-500 mb-3">
              by {product.seller.name || 'Unknown Seller'}
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
