import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

const Dashboard = () => {
  const [data, setData] = useState({});
  const [level, setLevel] = useState('year');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/water-usage-hierarchy')
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  useEffect(() => {
    if (!data[selectedYear]) return;

    if (level === 'year') {
      setTitle(`Water Usage in ${selectedYear} (Months)`);
      const months = data[selectedYear];
      const result = Object.entries(months).map(([month, monthData]) => {
        const total = sumValues(
          Object.values(monthData.weeks).reduce((acc, week) => ({ ...acc, ...week.days }), {})
        );
        return { name: month, waterUsed: total };
      });
      setChartData(result);
    } else if (level === 'month') {
      setTitle(`Water Usage in ${selectedMonth}, ${selectedYear} (Weeks)`);
      const weeks = data[selectedYear][selectedMonth].weeks;
      const result = Object.entries(weeks).map(([week, weekData]) => {
        const total = sumValues(weekData.days);
        return { name: `Week ${week}`, waterUsed: total };
      });
      setChartData(result);
    } else if (level === 'week') {
      setTitle(`Water Usage in Week ${selectedWeek} of ${selectedMonth}, ${selectedYear} (Days)`);
      const days = data[selectedYear][selectedMonth].weeks[selectedWeek].days;
      const result = Object.entries(days).map(([day, usage]) => {
        const fullDate = new Date(`${selectedYear}-${selectedMonth}-01`);
        fullDate.setDate(parseInt(day));
        return {
          name: fullDate.toDateString(),
          waterUsed: usage,
        };
      });
      setChartData(result);
    }
  }, [data, level, selectedYear, selectedMonth, selectedWeek]);

  const handleBarClick = (entry) => {
    const { name } = entry;
    if (level === 'year') {
      setSelectedMonth(name);
      setLevel('month');
    } else if (level === 'month') {
      const week = name.replace('Week ', '');
      setSelectedWeek(week);
      setLevel('week');
    } else if (level === 'week') {
      setSelectedDay(name);
      setLevel('day');
    }
  };

  const handleBack = () => {
    if (level === 'day') setLevel('week');
    else if (level === 'week') setLevel('month');
    else if (level === 'month') setLevel('year');
  };

  return (
    <div className="mt-10 max-w-6xl mx-auto p-6 text-white bg-gray-900 rounded-lg shadow-lg font-sans">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">{title}</h1>
      {level !== 'year' && (
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded transition"
        >
          ← Back
        </button>
      )}

      {level !== 'day' && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            onClick={({ activePayload }) => {
              if (activePayload && activePayload.length > 0) {
                handleBarClick(activePayload[0].payload);
              }
            }}
            className="cursor-pointer"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#bbb" />
            <YAxis stroke="#bbb" />
            <Tooltip
              contentStyle={{ backgroundColor: '#222', borderRadius: '8px', border: 'none' }}
              itemStyle={{ color: '#0ff' }}
            />
            <Legend />
            <Bar dataKey="waterUsed" fill="#0ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {level === 'day' && selectedDay && (
        <div className="bg-[#111] p-6 rounded-lg shadow-inner">
          <h2 className="text-xl mb-4 text-cyan-300">Water Usage Details for {selectedDay}</h2>
          <p className="text-lg">
            Usage: <span className="font-bold text-cyan-400">{
              data[selectedYear][selectedMonth].weeks[selectedWeek].days[
                new Date(selectedDay).getDate()
              ]
            } liters</span>
          </p>
          <button
            onClick={handleBack}
            className="mt-6 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded transition"
          >
            ← Back to Days
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
