import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {/* About Us */}
          <div>
            <h3 className="text-lg md:text-base font-semibold mb-3 md:mb-2">About Us</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted eyewear provider with over 15 years of experience.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg md:text-base font-semibold mb-3 md:mb-2">Customer Service</h3>
            <ul className="space-y-2 md:space-y-1">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-base font-semibold mb-3 md:mb-2">Quick Links</h3>
            <ul className="space-y-2 md:space-y-1">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Glasses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Sunglasses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contact Lenses
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg md:text-base font-semibold mb-3 md:mb-2">Follow Us</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 md:mt-6 pt-6 md:pt-4 text-center">
          <p className="text-gray-300 text-sm">
            &copy; 2025 Matnice Eyewear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
