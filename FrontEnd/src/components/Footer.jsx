import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">

        {/* About Section */}
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-2xl font-bold mb-4">
            <Droplet className="w-6 h-6" />
            <span>WaterTracker</span>
          </div>
          <p className="text-gray-400">
            Helping you track and reduce your water usage efficiently.
          </p>
          

  <div className="flex space-x-5 mt-6 text-gray-400 text-xl">
  <a href="https://twitter.com" aria-label="Twitter" className="hover:text-cyan-400 transition" target="_blank" rel="noopener noreferrer">
    <FaTwitter />
  </a>
  <a href="https://facebook.com" aria-label="Facebook" className="hover:text-cyan-400 transition" target="_blank" rel="noopener noreferrer">
    <FaFacebookF />
  </a>
  <a href="https://instagram.com" aria-label="Instagram" className="hover:text-cyan-400 transition" target="_blank" rel="noopener noreferrer">
    <FaInstagram />
  </a>
  <a href="https://github.com/" aria-label="GitHub" className="hover:text-cyan-400 transition" target="_blank" rel="noopener noreferrer">
    <FaGithub />
  </a>
  <a href="https://linkedin.com/" aria-label="LinkedIn" className="hover:text-cyan-400 transition" target="_blank" rel="noopener noreferrer">
    <FaLinkedinIn />
  </a>
</div>

        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/learn"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Learn
              </Link>
            </li>
            <li>
              <Link
                to="/calculator"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Calculate
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Water Saving Tips
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Conservation Guide
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Research
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
          <p className="text-gray-400 mb-4">
            Subscribe for updates on water conservation and new features.
          </p>
      <form className="flex space-x-2">
          <input
            type="email"
            placeholder="Your email address"
            required
            className="flex-grow px-4 py-2 rounded-md text-gray-900 bg-gray-100 border border-gray-300 focus:outline-none         focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md font-semibold transition"
          >
         Subscribe
         </button>
      </form>

        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-3">
        <p>© 2025 WaterTracker. All rights reserved.</p>
        <div className="flex space-x-6 text-gray-400">
          <Link to="/" className="hover:text-cyan-400 transition">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-cyan-400 transition">
            Terms of Service
          </Link>
          <Link to="/" className="hover:text-cyan-400 transition">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
