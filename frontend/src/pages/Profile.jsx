import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Package, Store, Camera, MapPin } from 'lucide-react';
import { getMe, updateProfile, updatePassword, requestSellerRole, logout, clearError } from '../redux/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [shippingData, setShippingData] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    area: user?.area || '',
  });

  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const response = await api.get('/auth/shipping-data');
        setShippingData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch shipping data');
      }
    };
    fetchShippingData();
  }, []);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    if (profileErrors[e.target.name]) {
      setProfileErrors({ ...profileErrors, [e.target.name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({ ...passwordErrors, [e.target.name]: '' });
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim()) errors.name = 'Name is required';
    if (!profileData.email) errors.email = 'Email is required';
    if (!profileData.area) errors.area = 'Area is required';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const areaOptions = shippingData.map(s => ({
    value: s.area,
    label: `${s.area} - Rs. ${s.charge}`
  }));

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    dispatch(updateProfile(profileData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully');
      })
      .catch((err) => {
        toast.error(err || 'Failed to update profile');
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    dispatch(updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }))
      .unwrap()
      .then(() => {
        toast.success('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch((err) => {
        toast.error(err || 'Failed to update password');
      });
  };

  const handleRequestSeller = () => {
    dispatch(requestSellerRole())
      .unwrap()
      .then(() => {
        toast.success('Seller request submitted! Awaiting admin approval.');
      })
      .catch((err) => {
        toast.error(err || 'Failed to submit request');
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-gray-400" size={48} />
              </div>
              <h3 className="font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium capitalize">
                {user?.role}
              </span>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'profile' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User size={18} />
                Profile
              </button>
              {user?.role !== 'admin' && (
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'password' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Lock size={18} />
                  Password
                </button>
              )}
            </nav>

            <hr className="my-4" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Package size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
              {user?.role === 'admin' ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-lg text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-lg text-gray-900">{user.email}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        error={profileErrors.name}
                        required
                      />
                    </div>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      error={profileErrors.email}
                      required
                    />
                    <div className="md:col-span-2">
                      <Select
                        label="Default Shipping Area (Karachi)"
                        name="area"
                        value={profileData.area}
                        onChange={handleProfileChange}
                        options={areaOptions}
                        placeholder="Select your default area"
                        error={profileErrors.area}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button type="submit" loading={loading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'password' && user?.role !== 'admin' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
              <form onSubmit={handleUpdatePassword}>
                <div className="space-y-4 max-w-md">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.currentPassword}
                    required
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.confirmPassword}
                    required
                  />
                </div>
                <div className="mt-6">
                  <Button type="submit" loading={loading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
