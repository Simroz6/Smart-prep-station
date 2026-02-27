import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Shield, Truck, RefreshCw, Award, MapPin } from 'lucide-react';
import { getFeaturedProducts, getProducts, getCategories } from '../redux/slices/productSlice';
import ProductGrid from '../components/ui/ProductGrid';
import CategoryGrid from '../components/ui/CategoryGrid';
import LocationSelector from '../components/ui/LocationSelector';

// Feature icons for the features bar
const features = [
  { icon: Shield, title: 'Expert Verified', desc: 'Solved by top AKUEB teachers', color: 'bg-emerald-100 text-emerald-600' },
  { icon: Award, title: 'Latest Syllabus', desc: 'Updated for current exams', color: 'bg-blue-100 text-blue-600' },
  { icon: RefreshCw, title: 'Easy Access', desc: 'Immediate download & delivery', color: 'bg-orange-100 text-orange-600' },
  { icon: Truck, title: 'Home Delivery', desc: 'Fast shipping across Pakistan', color: 'bg-purple-100 text-purple-600' },
];

const topResources = [
  { _id: '1', name: 'Mathematics', logo: 'https://placehold.co/120x60/1a1a2e/white?text=Math' },
  { _id: '2', name: 'Physics', logo: 'https://placehold.co/120x60/1a1a2e/white?text=Physics' },
  { _id: '3', name: 'Chemistry', logo: 'https://placehold.co/120x60/1a1a2e/white?text=Chemistry' },
  { _id: '4', name: 'Biology', logo: 'https://placehold.co/120x60/1a1a2e/white?text=Biology' },
  { _id: '5', name: 'English', logo: 'https://placehold.co/120x60/1a1a2e/white?text=English' },
  { _id: '6', name: 'Islamiat', logo: 'https://placehold.co/120x60/1a1a2e/white?text=Islamiat' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { featuredProducts, products, categories, loading } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFeaturedProducts());
    dispatch(getProducts({ limit: 100 })); // Fetch more products for accurate counts
    dispatch(getCategories());
  }, [dispatch]);

  // Calculate product count per category
  const categoryCounts = categories.reduce((acc, category) => {
    const count = products.filter(p => p.category?._id === category._id || p.category === category._id).length;
    acc[category._id] = count;
    return acc;
  }, {});

  return (
    <div>
      {/* Banner */}
      <section className="bg-emerald-600 py-16 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-32 -mt-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full -ml-24 -mb-24 opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <LocationSelector />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Smart Prep Station
          </h1>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Your one-stop destination for AKUEB Past Papers, SLO-based resources, and Comprehensive Notes to help you ace your exams.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Browse All Resources
            </Link>
            <Link
              to="/products?category=bundles"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
            >
              View Bundle Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center p-3">
                <div className={`p-3 rounded-full mb-3 ${feature.color}`}>
                  <feature.icon size={28} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Resource Categories</h2>
            <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {(() => {
            const categoriesWithCounts = categories.map(category => ({
              ...category,
              count: categoryCounts[category._id] || 0
            }));
            return <CategoryGrid categories={categories.length > 0 ? categoriesWithCounts : undefined} columns={4} />;
          })()}
        </div>
      </section>

      {/* Bundle Promo */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden h-80 shadow-xl border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80"
              alt="Bundle Promo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-lg">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">MOST POPULAR</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Full Syllabus Study Packs
                </h2>
                <p className="text-emerald-50 mb-6">
                  Get Past Papers, SLOs, and Notes for all subjects in one discounted bundle. Save up to 40%!
                </p>
                <Link
                  to="/products?category=bundles"
                  className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg"
                >
                  Explore Bundle Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Bestselling Resources</h2>
              <p className="text-gray-500 text-sm">Everything you need to succeed in AKUEB exams</p>
            </div>
            <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts.length > 0 ? featuredProducts : []} loading={loading} columns={3} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prepare Smarter, Not Harder
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who achieved A+ grades using our comprehensive preparation materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
