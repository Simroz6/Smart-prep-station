import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Subscribe to our Newsletter
              </h3>
              <p className="text-emerald-100">
                Get the latest products and new arrivals directly in your inbox.
              </p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-l-lg focus:outline-none text-gray-900"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="mb-6">
              <span className="text-2xl font-bold text-emerald-500">Smart Prep Station</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for quality AKUEB preparation materials.
              Prepare smarter with our expert-verified resources.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-500 transition-colors">Shop All</Link>
              </li>
              <li>
                                 <Link to="/products?category=bundles" className="hover:text-emerald-500 transition-colors">Bundle Deals</Link>              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-emerald-500 mt-1 flex-shrink-0" />
                <span>123 Market Street, Business District, City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-emerald-500 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-emerald-500 flex-shrink-0" />
                <span>support@smartprepstation.com</span>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-emerald-500" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-emerald-500" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={20} className="text-emerald-500" />
                  <span className="text-sm">Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={20} className="text-emerald-500" />
                  <span className="text-sm">COD Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Smart Prep Station. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://placehold.co/40x24/1a1a1a/white?text=Visa" alt="Visa" className="h-6" />
              <img src="https://placehold.co/40x24/1a1a1a/white?text=MC" alt="Mastercard" className="h-6" />
              <img src="https://placehold.co/40x24/1a1a1a/white?text=Easy" alt="Easypaisa" className="h-6" />
              <img src="https://placehold.co/40x24/1a1a1a/white?text=Jazz" alt="JazzCash" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
