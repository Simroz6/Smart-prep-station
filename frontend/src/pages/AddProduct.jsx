import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Upload, X, DollarSign, Box, Tag } from 'lucide-react';
import { createProduct, updateProduct, getProduct, getCategories, clearCurrentProduct } from '../redux/slices/productSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, categories, loading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    images: [],
    variants: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newVariant, setNewVariant] = useState({ name: '', options: '' });
  const [errors, setErrors] = useState({});
  const isEdit = !!id;

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getProduct(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (currentProduct && isEdit) {
      setFormData({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price?.toString() || '',
        stock: currentProduct.stock?.toString() || '',
        category: currentProduct.category?._id || currentProduct.category || '',
        brand: currentProduct.brand || '',
        images: currentProduct.images || [],
        variants: currentProduct.variants || [],
      });
      setImagePreviews(currentProduct.images?.map(img => img.url) || []);
    }
  }, [currentProduct, isEdit]);

  const addVariant = () => {
    if (!newVariant.name || !newVariant.options) {
      toast.error('Please provide variant name and options');
      return;
    }
    const optionsArray = newVariant.options.split(',').map(o => o.trim()).filter(o => o);
    if (optionsArray.length === 0) {
      toast.error('Please provide at least one option');
      return;
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: newVariant.name, options: optionsArray }]
    }));
    setNewVariant({ name: '', options: '' });
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: reader.result, publicId: 'local' }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (parseFloat(formData.price) < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.stock && formData.stock !== '0') newErrors.stock = 'Stock is required';
    if (parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      brand: formData.brand,
      images: formData.images,
      variants: formData.variants,
    };

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, data: productData })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product created successfully');
      }
      navigate('/seller/dashboard');
    } catch (error) {
      toast.error(error || 'Failed to save product');
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/seller/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
                <Upload className="text-gray-400 mb-2" size={24} />
                <span className="text-xs text-gray-500">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">Maximum 5 images, 5MB each</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Product Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                error={errors.title}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter product description"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              error={errors.category}
              required
            />

            <Input
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
            />

            <Input
              label="Price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.price}
              required
            />

            <Input
              label="Stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              error={errors.stock}
              required
            />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h2>
          <div className="space-y-4 mb-6">
            {formData.variants.map((v, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{v.name}:</span>
                  <span className="ml-2 text-gray-600">{v.options.join(', ')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <Input
              label="Variant Name (e.g., Subject, Class)"
              value={newVariant.name}
              onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
              placeholder="Variant name"
            />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="Options (comma separated)"
                  value={newVariant.options}
                  onChange={(e) => setNewVariant({ ...newVariant, options: e.target.value })}
                  placeholder="e.g., Physics, Chemistry, Biology"
                />
              </div>
              <Button type="button" onClick={addVariant} variant="outline" className="mb-1">
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/seller/dashboard')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
