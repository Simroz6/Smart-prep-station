import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-emerald-500" size={28} />
              <span className="text-2xl font-bold text-white">ShopHub</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
                             Your one-stop Smart Prep Station for quality products from trusted sellers.              Shop with confidence and enjoy fast delivery.
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
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-emerald-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-emerald-500 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="text-sm hover:text-emerald-500 transition-colors">
                  Sell on ShopHub
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  Wishlist
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-emerald-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="text-sm">
                  123 Market Street<br />
                  City, State 12345<br />
                  Country
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="text-sm">support@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-emerald-500 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
