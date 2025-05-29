import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Droplet, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses =
    'block md:inline-block px-4 py-2 font-medium transition duration-200 rounded-md';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-cyan-400 font-bold text-xl">
            <Droplet className="w-6 h-6" />
            <span>WaterTracker</span>
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {['/', '/learn', '/calculator', '/dashboard'].map((path, index) => {
              const labels = ['Home', 'Learn', 'Calculate', 'Dashboard'];
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `${navLinkClasses} ${
                      isActive
                        ? 'bg-cyan-700 text-white'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                    }`
                  }
                >
                  {labels[index]}
                </NavLink>
              );
            })}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-cyan-400 hover:text-white focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden md:flex space-x-3">
            <Link
              to="/auth"
              className="px-4 py-2 bg-cyan-500 text-white rounded-full shadow hover:bg-cyan-600 transition font-medium"
            >
              Login
            </Link>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4 border-t border-gray-700">
            {['/', '/learn', '/calculator', '/dashboard'].map((path, index) => {
              const labels = ['Home', 'Learn', 'Calculate', 'Dashboard'];
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `${navLinkClasses} ${
                      isActive
                        ? 'bg-cyan-700 text-white'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                    }`
                  }
                >
                  {labels[index]}
                </NavLink>
              );
            })}
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 bg-cyan-500 text-white rounded-md text-center hover:bg-cyan-600 transition font-medium"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
