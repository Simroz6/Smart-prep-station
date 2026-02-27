import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { getCart } from '../redux/slices/cartSlice';
import CartItem from '../components/CartItem';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated, user, guestArea } = useSelector((state) => state.auth);
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart()).unwrap().catch((error) => {
        toast.error(error || 'Failed to load cart');
      });
    }

    const fetchShippingData = async () => {
      try {
        const response = await api.get('/auth/shipping-data');
        setShippingData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch shipping data');
      }
    };
    fetchShippingData();
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">Please login to view your cart</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const currentArea = user?.area || guestArea || '';
  const areaInfo = shippingData.find(s => s.area === currentArea);
  const shippingCost = areaInfo ? areaInfo.charge : 0;
  const total = (cart.subtotal || 0) + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cart.items?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.product?._id || item._id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>Rs. {cart.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping {currentArea ? `(${currentArea})` : ''}</span>
                  <span>Rs. {shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              {!currentArea && (
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mb-4">
                  Please select a delivery area in the header to see accurate shipping costs.
                </p>
              )}

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </Button>

              <Link
                to="/products"
                className="block text-center text-emerald-600 hover:text-emerald-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything yet</p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

