import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { Loader2, User, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingUserId, setProcessingUserId] = useState(null); // New state for loading indicator
  const [showEditRoleModal, setShowEditRoleModal] = useState(false); // State for modal visibility
  const [editingUser, setEditingUser] = useState(null); // State for the user being edited
  const [selectedRole, setSelectedRole] = useState(''); // State for the role selected in the modal

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users.');
      toast.error('Failed to fetch users.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    setProcessingUserId(userId);
    try {
      const response = await adminService.toggleUserStatus(userId);
      toast.success(response.message);
      fetchUsers(); // Re-fetch to update the list
    } catch (err) {
      toast.error('Failed to toggle user status.');
      console.error('Error toggling user status:', err);
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleEditRoleClick = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!editingUser || !selectedRole) return;

    setProcessingUserId(editingUser._id); // Use processingUserId for modal save loading
    try {
      await adminService.updateUserRole(editingUser._id, selectedRole);
      toast.success(`User ${editingUser.name}'s role updated to ${selectedRole}.`);
      fetchUsers();
      setShowEditRoleModal(false);
      setEditingUser(null);
      setSelectedRole('');
    } catch (err) {
      toast.error('Failed to update user role.');
      console.error('Error updating user role:', err);
    } finally {
      setProcessingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">All User Accounts</h3>
      {users.length === 0 ? (
        <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800 text-center">
          <p>No user accounts found.</p>
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
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Shield size={16} className="mr-2 text-gray-500" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditRoleClick(user)}
                      className="text-emerald-600 hover:text-emerald-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={processingUserId === user._id}
                    >
                      Edit Role
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user._id)}
                      disabled={processingUserId === user._id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingUserId === user._id && <Loader2 className="animate-spin mr-1 inline-block" size={16} />}
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Role for {editingUser.name}</h3>
            <div className="mt-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Select New Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="items-center px-4 py-3">
              <button
                id="save-button"
                className="px-4 py-2 bg-emerald-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateRole}
                disabled={processingUserId === editingUser._id}
              >
                {processingUserId === editingUser._id && <Loader2 className="animate-spin mr-2 inline-block" size={16} />}
                Save
              </button>
              <button
                id="cancel-button"
                className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setShowEditRoleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
