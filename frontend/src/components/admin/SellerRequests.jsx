import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

export default function SellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchSellerRequests();
  }, []);

  const fetchSellerRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getSellerRequests();
      setRequests(response.data);
    } catch (err) {
      setError('Failed to fetch seller requests.');
      toast.error('Failed to fetch seller requests.');
      console.error('Error fetching seller requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = async (id, status) => {
    setProcessingId(id);
    try {
      await adminService.reviewSellerRequest(id, status);
      toast.success(`Seller request ${status}ed successfully!`);
      fetchSellerRequests(); // Re-fetch requests to update the list
    } catch (err) {
      toast.error(`Failed to ${status} seller request.`);
      console.error(`Error ${status}ing seller request:`, err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <span className="ml-2 text-gray-600">Loading seller requests...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Pending Seller Requests</h3>
      {requests.length === 0 ? (
        <div className="p-4 border rounded-lg bg-green-50 text-green-800 text-center">
          <p>No pending seller requests at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested At
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.sellerRequest.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleReviewRequest(request._id, 'approved')}
                      disabled={processingId === request._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
                    >
                      {processingId === request._id ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle size={16} className="mr-1" />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReviewRequest(request._id, 'rejected')}
                      disabled={processingId === request._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {processingId === request._id ? <Loader2 className="animate-spin mr-2" size={16} /> : <XCircle size={16} className="mr-1" />}
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
