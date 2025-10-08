import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-base font-semibold mb-2">About Us</h3>
            <p className="text-gray-300 text-sm">
              Your trusted eyewear provider with over 15 years of experience.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">Customer Service</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Glasses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Sunglasses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Contact Lenses</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-sm">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">Twitter</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-gray-300 text-sm">&copy; 2025 Matnice Eyewear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
