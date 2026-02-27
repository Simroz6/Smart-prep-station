import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Clock, CheckCircle, XCircle, Truck, Package, PackageCheck, Calendar, MapPin, CreditCard } from 'lucide-react';
import { getOrder, cancelOrder } from '../redux/slices/orderSlice';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-indigo-100 text-indigo-800', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: PackageCheck, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getOrder(id));
    }
  }, [dispatch, id, isAuthenticated]);

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    dispatch(cancelOrder({ id: order._id, reason: cancelReason }))
      .unwrap()
      .then(() => {
        toast.success('Order cancelled successfully');
        setShowCancelModal(false);
        setCancelReason('');
      })
      .catch((error) => {
        toast.error(error || 'Failed to cancel order');
      });
  };

  const canCancel = order && ['pending', 'confirmed'].includes(order.status);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Orders
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <StatusIcon size={18} />
            {statusInfo.label}
          </span>
          {canCancel && (
            <Button variant="danger" onClick={() => setShowCancelModal(true)}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.image || 'https://placehold.co/80x80/cccccc/666666?text=No+Image'}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    
                    {/* Selected Variants */}
                    {item.selectedVariants && item.selectedVariants.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1 mb-1">
                        {item.selectedVariants.map((v, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {v.name}: {v.option}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Rs.{item.price?.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </p>
                    {order.status === 'delivered' && (
                      <Link to={`/products/${item.product._id}/review`}>
                        <Button size="sm" className="mt-2">
                          Write a Review
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {order.statusHistory?.map((history, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    {index < order.statusHistory.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{statusConfig[history.status]?.label || history.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(history.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p className="mt-2">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
            </div>
            <p className="text-gray-600 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <p className={`text-sm font-medium mt-2 ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
            </p>
          </div>

          {/* Order Total */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h2>
                          <div className="space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>Rs.{order.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>Rs.{order.shippingCost?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>Rs.{order.tax?.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>Rs.{order.totalAmount?.toFixed(2)}</span>
                          </div>
                        </div>          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your reason..."
            />
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" onClick={() => setShowCancelModal(false)} className="flex-1">
                Keep Order
              </Button>
              <Button variant="danger" onClick={handleCancelOrder} className="flex-1">
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
