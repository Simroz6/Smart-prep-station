import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { updateCartItem, removeFromCart } from '../redux/slices/cartSlice';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.product?.stock) return;
    
    setIsUpdating(true);
    try {
      await dispatch(updateCartItem({ 
        itemId: item._id, 
        quantity: newQuantity 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await dispatch(removeFromCart(item._id)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const imageUrl = item.image || item.product?.images?.[0]?.url || 'https://placehold.co/80x80/cccccc/666666?text=No+Image';
  const title = item.title || item.product?.title || 'Unknown Product';
  const price = item.price || item.product?.price || 0;
  const quantity = item.quantity;
  const stock = item.product?.stock || 999;
  const productId = item.product?._id || item.product;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-20 h-20 rounded-lg object-cover"
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        
        {/* Selected Variants */}
        {item.selectedVariants && item.selectedVariants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {item.selectedVariants.map((v, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {v.name}: {v.option}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-2">
          Rs. {price?.toLocaleString()} each
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock || isUpdating}
              className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          Rs. {(price * quantity).toLocaleString()}
        </p>
        {stock < 5 && (
          <p className="text-xs text-orange-500 mt-1">
            Only {stock} left
          </p>
        )}
      </div>
    </div>
  );
}
