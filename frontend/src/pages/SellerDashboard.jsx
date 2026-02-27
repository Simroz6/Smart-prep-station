import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Plus, DollarSign, ShoppingBag, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import { getSellerProducts, deleteProduct } from '../redux/slices/productSlice';
import { getSellerOrders, updateSellerOrderStatus, getSellerRevenue } from '../redux/slices/orderSlice';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { sellerProducts } = useSelector((state) => state.products);
  const { sellerOrders, sellerRevenue, loading } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('overview');
  const [productParams, setProductParams] = useState({});

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === 'seller' || user?.role === 'admin')) {
      dispatch(getSellerProducts(productParams));
      dispatch(getSellerOrders({}));
    }
  }, [dispatch, isAuthenticated, user, productParams]);

  useEffect(() => {
    if (user) {
      dispatch(getSellerRevenue('month'));
    }
  }, [dispatch, user]);

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          toast.success('Product deleted successfully');
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete product');
        });
    }
  };

  const handleStatusUpdate = (orderId, status) => {
    const isRejecting = status === 'rejected';
    const confirmationMessage = isRejecting
      ? 'Are you sure you want to reject this order? This will move it to the cancelled state.'
      : `Are you sure you want to update the status to ${status}?`;

    if (window.confirm(confirmationMessage)) {
      const newStatus = isRejecting ? 'cancelled' : status;
      dispatch(updateSellerOrderStatus({ orderId, status: newStatus }))
        .unwrap()
        .then(() => {
          toast.success(`Order status updated to ${newStatus}`);
          dispatch(getSellerOrders({}));
          dispatch(getSellerRevenue('month'));
        })
        .catch((error) => {
          const errorMessage = error?.message || error || 'Failed to update order status';
          toast.error(errorMessage);
        });
    }
  };

  if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin')) {
    return null;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => navigate('/seller/products/new')}>
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {(sellerRevenue?.summary?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {sellerOrders?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {sellerProducts?.pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Order</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {(sellerRevenue?.summary?.avgOrderValue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['overview', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
            <Button size="sm" onClick={() => navigate('/seller/products/new')}>
              <Plus size={16} className="mr-1" />
              Add Product
            </Button>
          </div>

          {sellerProducts?.products?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sellerProducts.products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.url || 'https://placehold.co/50x50/cccccc/666666?text=No+Image'}
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-gray-900">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">Rs. {product.price?.toLocaleString()}</td>
                      <td className="px-4 py-4 text-gray-600">{product.stock}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/seller/products/${product._id}/edit`)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">Start selling by adding your first product</p>
              <Button onClick={() => navigate('/seller/products/new')}>
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Seller Orders</h2>

          {sellerOrders?.orders?.length > 0 ? (
            <div className="space-y-4">
              {sellerOrders.orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">Customer: {order.customer?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Items: {order.items?.length || 0}</p>
                    <p>Total: Rs. {order.sellerSubtotal?.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">
                      Ordered: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500">Orders will appear here when customers purchase your products</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            {sellerOrders?.orders?.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Rs. {order.sellerSubtotal?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Products</h2>
            {sellerProducts?.products?.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <img
                  src={product.images?.[0]?.url || 'https://placehold.co/50x50/cccccc/666666?text=No+Image'}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <p className="font-medium text-gray-900">Rs.{product.price?.toFixed(2)}</p>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No products yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
