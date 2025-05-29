import React from 'react';
import {useNavigate } from 'react-router-dom';
const Learn = () => {
  const navigate=useNavigate();
  const articles = [
    {
      title: 'Understanding Water Scarcity',
      description: 'Explore the causes and consequences of water scarcity and what we can do to manage it better.',
      link:'https://www.unwater.org/water-facts/water-scarcity'
    },
    {
      title: 'Daily Habits to Conserve Water',
      description: 'Discover small lifestyle changes that can lead to big water savings in your home.',
      link:'https://www.cityofprineville.com/publicworks/page/how-conserve-water-your-home?utm_source=chatgpt.com'
    },
    {
      title: 'Impact of Overusing Water',
      description: 'Learn how excessive water usage affects the environment and local communities.',
    },
    {
      title: 'How to Track Your Water Usage',
      description: 'Learn practical ways to monitor and reduce your daily water consumption.',
    },
  ];

  return (
    <div className="text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Learn About Water Conservation</h1>
      {articles.map((article, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-auto hover:scale-[1.02] transition-transform"
        >
          <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
          <p className="text-sm text-blue-100 mb-4">{article.description}</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition" target='_blank' onClick={() => window.open(article.link, '_blank')}>
            Read More
          </button>
        </div>
      ))}
    </div>
  );
};

export default Learn;
