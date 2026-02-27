import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star, Minus, Plus, ArrowLeft, Truck, Shield, RefreshCw, Tag, Share2 } from 'lucide-react';
import { getProduct, addReview, getCategories } from '../redux/slices/productSlice';
import { addToCart, buyNow } from '../redux/slices/cartSlice';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Product link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  useEffect(() => {
    if (product?.variants) {
      const initialVariants = {};
      product.variants.forEach(variant => {
        initialVariants[variant.name] = variant.options[0];
      });
      setSelectedVariants(initialVariants);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const variantsArray = Object.entries(selectedVariants).map(([name, option]) => ({
      name,
      option
    }));

    dispatch(addToCart({ productId: product._id, quantity, selectedVariants: variantsArray }))
      .unwrap()
      .then(() => {
        toast.success('Added to cart');
      })
      .catch((error) => {
        toast.error(error || 'Failed to add to cart');
      });
  };

  const handleVariantChange = (name, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    const variantsArray = Object.entries(selectedVariants).map(([name, option]) => ({
      name,
      option
    }));

    dispatch(buyNow({ productId: product._id, quantity, selectedVariants: variantsArray }))
      .unwrap()
      .then(() => {
        navigate('/checkout');
      })
      .catch((error) => {
        toast.error(error || 'Failed to process checkout');
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(addReview({ id: product._id, ...reviewData }))
      .unwrap()
      .then(() => {
        toast.success('Review added successfully');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
      })
      .catch((error) => {
        toast.error(error || 'Failed to add review');
      });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://placehold.co/500x500/cccccc/666666?text=No+Image';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div>
          {/* Category */}
          <p className="text-sm text-emerald-600 font-medium mb-2">
            {product.category?.name || 'Uncategorized'}
          </p>

          {/* Title */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
              title="Share Product"
            >
              <Share2 size={24} />
            </button>
          </div>

          {/* Rating */}
          {product.rating?.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(product.rating.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.average?.toFixed(1)} ({product.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Seller */}
          <p className="text-sm text-gray-500 mb-4">
            Resource by: <span className="font-medium text-emerald-600">Smart Prep Station</span>
          </p>

          {/* Deals Section */}
          <div className="mb-6">
            {product.category?.name === 'Bundles' ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-full">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-orange-800">BEST VALUE DEAL</p>
                  <p className="text-sm text-orange-700">This bundle includes multiple resources at a discounted price!</p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-600 text-white p-2 rounded-full">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900">Save up to 40% with Bundles!</p>
                    <p className="text-sm text-emerald-700">Get this subject as part of a Full Study Pack.</p>
                  </div>
                </div>
                <Link 
                  to="/products?category=bundles"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap"
                >
                  View Bundle Deals
                </Link>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">Rs. {product.price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">
                Rs. {product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 mb-6">
              {product.variants.map((variant) => (
                <div key={variant.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleVariantChange(variant.name, option)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedVariants[variant.name] === option
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stock */}
          <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1"
              size="lg"
            >
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Truck className="mx-auto text-emerald-600 mb-1" size={24} />
              <p className="text-xs text-gray-600">Fast Delivery</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto text-emerald-600 mb-1" size={24} />
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
            <div className="text-center">
              <RefreshCw className="mx-auto text-emerald-600 mb-1" size={24} />
              <p className="text-xs text-gray-600">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {isAuthenticated && (
            <Button onClick={() => setShowReviewForm(!showReviewForm)} variant="outline">
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Write Your Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
 {[...Array(5)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Star{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <Button type="submit">Submit Review</Button>
          </form>
        )}

        {/* Reviews List */}
        {product.reviews?.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">{review.user?.name || 'User'}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
