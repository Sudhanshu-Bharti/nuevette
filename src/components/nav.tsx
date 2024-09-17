import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-stone-400/10 shadow-md sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              Nuevette
              <span className="text-red-500">.</span>
              <span className="text-orange-500">ai</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
