import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateArea } from '../../redux/slices/authSlice';
import api from '../../services/api';

export default function LocationSelector() {
  const dispatch = useDispatch();
  const { user, guestArea, isAuthenticated } = useSelector((state) => state.auth);
  const [shippingData, setShippingData] = useState([]);
  
  const currentArea = user?.area || guestArea || '';

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

  const handleSelect = async (e) => {
    const area = e.target.value;
    if (!area) return;
    
    dispatch(updateArea(area));
    
    if (isAuthenticated) {
      try {
        await api.put('/auth/area', { area });
      } catch (err) {
        console.error('Failed to update profile area', err);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center group">
      <div className="absolute left-3 text-emerald-100 group-hover:text-white transition-colors pointer-events-none">
        <MapPin size={18} />
      </div>
      <select
        value={currentArea}
        onChange={handleSelect}
        className="appearance-none bg-emerald-700/50 hover:bg-emerald-700/80 backdrop-blur-md text-white pl-10 pr-10 py-2.5 rounded-full border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer text-sm font-medium min-w-[220px]"
      >
        <option value="" disabled className="text-gray-900">Select Delivery Area</option>
        {shippingData.map((item) => (
          <option key={item.area} value={item.area} className="text-gray-900">
            {item.area} - Rs. {item.charge}
          </option>
        ))}
      </select>
      <div className="absolute right-3 text-emerald-100 group-hover:text-white transition-colors pointer-events-none">
        <ChevronDown size={18} />
      </div>
    </div>
  );
}
