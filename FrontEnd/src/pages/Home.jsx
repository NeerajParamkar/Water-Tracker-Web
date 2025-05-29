import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';

const Home = () => {
  return (
    <section className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20 relative">
      <div className="absolute inset-0 opacity-5 bg-[url('/noise-texture.png')] bg-cover bg-center pointer-events-none" />
      
      <div className="max-w-4xl text-center z-10">
        <div className="flex justify-center mb-6">
          <Droplet className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Track Your Water Usage <br /> & Conserve Every Drop
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8">
          WaterTracker helps you monitor your daily water consumption, set smart goals,
          and join a community of eco-conscious users.
        </p>
        <div className="flex justify-center gap-4">
          
          <Link
            to="/dashboard"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/calculator"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Add today's Usage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
