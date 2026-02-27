import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck, PackageCheck } from 'lucide-react';
import { getOrders } from '../redux/slices/orderSlice';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-indigo-100 text-indigo-800', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: PackageCheck, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
};

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, pagination } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const params = filter !== 'all' ? { status: filter } : {};
    dispatch(getOrders(params));
  }, [dispatch, filter]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusInfo = (status) => statusConfig[status] || statusConfig.pending;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/orders/${order._id}`} className="block">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                        <ChevronRight className="text-gray-400" size={20} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.image || 'https://placehold.co/40x40/cccccc/666666?text=No+Image'}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg border-2 border-white object-cover"
                          />
                        ))}
                        {order.items?.length > 3 && (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-semibold text-gray-900">
                        Rs. {order.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't placed any orders</p>
          <Link to="/products">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
