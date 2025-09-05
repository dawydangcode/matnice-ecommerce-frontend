import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300">
              Your trusted eyewear provider with over 15 years of experience.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Glasses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Sunglasses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact Lenses</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; 2025 Matnice Eyewear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
