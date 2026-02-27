import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { createOrder, clearCurrentOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { loading, currentOrder } = useSelector((state) => state.orders);
  const { isAuthenticated, user, guestArea } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Karachi',
    state: 'Sindh',
    area: user?.area || guestArea || '',
    postalCode: '',
    phone: '',
    paymentMethod: 'cod',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  const [shippingData, setShippingData] = useState([]);
  const [isProcessingPayment, setIsProcessingProcessing] = useState(false);
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (currentOrder) {
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      navigate(`/orders/${currentOrder._id}`);
      dispatch(clearCurrentOrder());
    }
  }, [currentOrder, dispatch, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    if (formData.paymentMethod === 'online') {
      if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!formData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Expiry date (MM/YY) is required';
      }
      if (!formData.cvv.trim() || formData.cvv.length < 3) {
        newErrors.cvv = 'Valid CVV is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Formatting for card number
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    }
    // Formatting for expiry
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim().slice(0, 5);
    }
    // Formatting for CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    if (name === 'area') {
      const selectedArea = shippingData.find(s => s.area === value);
      setFormData({
        ...formData,
        area: value,
        postalCode: selectedArea?.postalCode || ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!cart.items?.length) {
      toast.error('Your cart is empty');
      return;
    }

    if (formData.paymentMethod === 'online') {
      setIsProcessingProcessing(true);
      toast.loading('Processing payment...', { id: 'payment' });
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment authorized!', { id: 'payment' });
      setIsProcessingProcessing(false);
    }

    dispatch(createOrder({
      shippingAddress: {
        fullName: formData.fullName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone,
      },
      paymentMethod: formData.paymentMethod,
    }));
  };

  if (!isAuthenticated || !cart || !cart.items?.length) {
    return null;
  }

  const subtotal = cart.subtotal || 0;
  
  // Calculate dynamic shipping cost
  let shippingCost = 0;
  const areaInfo = shippingData.find(s => s.area === formData.area);
  shippingCost = areaInfo ? areaInfo.charge : 0;

  const total = subtotal + shippingCost;

  const areaOptions = shippingData.map(s => ({
    value: s.area,
    label: `${s.area} - Rs. ${s.charge}`
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6"
      >
        <ArrowLeft size={20} />
        Back to Cart
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="text-emerald-600" size={24} />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={errors.fullName}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address"
                    error={errors.addressLine1}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Address Line 2 (Optional)"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <Select
                    label="Area (Karachi)"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    options={areaOptions}
                    placeholder="Select your area"
                    error={errors.area}
                    required
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  error={errors.city}
                  required
                />

                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  error={errors.state}
                  required
                />

                <Input
                  label="Postal Code (Optional)"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  error={errors.postalCode}
                  disabled
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  error={errors.phone}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="text-emerald-600" size={24} />
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-start sm:items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mt-1 sm:mt-0 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>

                <label className={`flex items-start sm:items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${formData.paymentMethod === 'online' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleChange}
                    className="mt-1 sm:mt-0 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Credit / Debit Card</p>
                    <p className="text-sm text-gray-500">Secure online payment</p>
                  </div>
                </label>

                {/* Card Details Form */}
                {formData.paymentMethod === 'online' && (
                  <div className="mt-4 p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Name on Card"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          error={errors.cardName}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Card Number"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="0000 0000 0000 0000"
                          error={errors.cardNumber}
                          required
                        />
                      </div>
                      <Input
                        label="Expiry Date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        error={errors.expiryDate}
                        required
                      />
                      <Input
                        label="CVV"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        error={errors.cvv}
                        required
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <CreditCard size={14} />
                      Your payment is encrypted and secure.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                {cart.items.map((item) => (
                  <div key={item.product?._id || item._id} className="flex gap-3">
                    <img
                      src={item.image || 'https://placehold.co/50x50/cccccc/666666?text=No+Image'}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">Rs{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `Rs. ${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                loading={loading || isProcessingPayment}
                disabled={isProcessingPayment}
              >
                {formData.paymentMethod === 'online' ? 'Pay & Place Order' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
