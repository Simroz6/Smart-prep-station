import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItem } from '../../redux/slices/cartSlice';
import Button from './Button';

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  const handleQuantityChange = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      dispatch(updateCartItem({ itemId, quantity: newQty }));
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <Fragment>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} />
            Shopping Cart
            {items.length > 0 && (
              <span className="text-sm text-gray-500">({items.length} items)</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Please login to view cart
              </h3>
              <p className="text-gray-500 mb-4">
                Sign in to access your shopping cart
              </p>
              <Link to="/login" onClick={onClose}>
                <Button>Login</Button>
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products" onClick={onClose}>
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item._id} className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || 'https://placehold.co/80x80/cccccc/666666?text=No+Image'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product?._id}`}
                        className="text-sm font-medium text-gray-900 hover:text-emerald-600 line-clamp-2"
                        onClick={onClose}
                      >
                        {item.title}
                      </Link>
                      
                      {/* Selected Variants */}
                      {item.selectedVariants && item.selectedVariants.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedVariants.map((v, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                              {v.option}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Rs. {item.price?.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity, -1)
                            }
                            className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity, 1)
                            }
                            className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-base">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                Rs. {subtotal?.toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link to="/cart" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  View Cart
                </Button>
              </Link>
              <Link to="/checkout" onClick={onClose}>
                <Button className="w-full" loading={loading}>
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}
