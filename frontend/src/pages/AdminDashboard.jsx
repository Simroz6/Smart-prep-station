import React, { useEffect, useState } from 'react';
import SellerRequests from '../components/admin/SellerRequests';
import UserManagement from '../components/admin/UserManagement';
import adminService from '../services/adminService';

const AdminDashboard = () => {
  const [sellerAnalytics, setSellerAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerAnalytics = async () => {
      try {
        const response = await adminService.getSellerAnalytics();
        setSellerAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching seller analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAnalytics();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Seller Approval Section */}
      <section className="mb-8">
        <SellerRequests />
      </section>

      {/* User Management Section */}
      <section className="mb-8">
        <UserManagement />
      </section>

      {/* Seller Analytics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seller Analytics</h2>
        {loading ? (
          <p>Loading seller analytics...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Seller Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Products Listed
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellerAnalytics.length > 0 ? (
                  sellerAnalytics.map((seller) => (
                    <tr key={seller._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{seller.name}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{seller.email}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{seller.productCount}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">${seller.totalProfit.toFixed(2)}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                      No seller analytics available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
