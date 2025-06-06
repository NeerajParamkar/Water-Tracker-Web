import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const Calculate = () => {
  const [used, setUsed] = useState(0);
  const [target, setTarget] = useState(100);
  const [tempTarget, setTempTarget] = useState('100');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [usageHistory, setUsageHistory] = useState([]);

  const hasFetched = useRef(false);

  const getuser = () => {
    const today = new Date().toLocaleDateString('en-CA');
    fetch(`http://localhost:3000/dailyusage?date=${today}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (json.data && json.data.length > 0) {
            const fetchedGoal = json.data[0].goal;
            setTarget(fetchedGoal);
            setTempTarget(String(fetchedGoal));
          }
          setUsed(json.totalAmount || 0);
          setUsageHistory(json.data || []);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  };

 const OnSubmitHandler = async () => {
  axios.defaults.withCredentials = true;

  try {
    const { data } = await axios.post(`http://localhost:3000/data`, {
      purpose,
      amount: Number(amount),
      goal: target,
    });
    if (data.success) {
      toast.success(data.message);
      // Optionally clear inputs or update UI here
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Error submitting data");
    console.error(error);
  }
};


  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    getuser();
  }, []);

  const handleTempTargetChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^[0-9]*$/.test(val)) {
      setTempTarget(val);
    }
  };

  const handleSetGoal = () => {
    const val = Number(tempTarget);
    if (val >= 0) {
      setTarget(val);
    }
  };

  const handleAddUsage = () => {
    const numericAmount = Number(amount);
    if (numericAmount > 0 && purpose.trim()) {
      const newEntry = {
        id: Date.now(),
        purpose,
        amount: numericAmount,
        goal: target,
        time: new Date().toLocaleTimeString()
      };
      setUsageHistory((prev) => [...prev, newEntry]);
      setUsed((prev) => prev + numericAmount);
      setPurpose('');
      setAmount('');
    }
  };

 const handleRemoveUsage = async (_id, amt) => {
  try {
    const res = await axios.delete('http://localhost:3000/delete-usage', {
      data: { id: _id },
    });

    if (res.data.success) {
      setUsageHistory((prev) => prev.filter((entry) => entry._id !== _id));
      setUsed((prev) => Math.max(0, prev - amt));
      toast.success("Deleted successfully");
    } else {
      toast.error(res.data.message || "Failed to delete.");
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Server error during delete");
  }
};


  const percentage = target === 0 ? 0 : (used / target) * 100;

  const getGradientColor = (percent) => {
    const clamped = Math.min(percent, 100);
    const r = Math.floor((clamped / 100) * 255);
    const g = Math.floor((1 - clamped / 100) * 128 + (1 - clamped / 100) * 127);
    const b = 0;
    return `rgb(${r},${g},${b})`;
  };

  const progressColor = getGradientColor(percentage);

  const getMessageAndColor = (percent) => {
    if (percent === 0) return { message: 'No water used yet.', color: 'text-gray-400' };
    if (percent <= 30) return { message: `Just started! You’ve used ${Math.round(percent)}% of your goal.`, color: 'text-blue-400' };
    if (percent <= 50) return { message: `Making progress! Used ${Math.round(percent)}%.`, color: 'text-green-400' };
    if (percent <= 70) return { message: `Over halfway there! Used ${Math.round(percent)}%.`, color: 'text-yellow-400' };
    if (percent <= 85) return { message: `Getting close! Used ${Math.round(percent)}%.`, color: 'text-orange-400' };
    if (percent < 100) return { message: `⚠️ Warning! Close to your limit at ${Math.round(percent)}%.`, color: 'text-red-500' };
    if (percent === 100) return { message: `🚨 Limit reached! Used exactly ${Math.round(percent)}%.`, color: 'text-red-600 font-bold' };
    return { message: `🚨 Limit exceeded! Used ${Math.round(percent)}%!`, color: 'text-red-700 font-bold' };
  };

  const { message, color } = getMessageAndColor(percentage);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 text-white font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#121212] p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">💧 Daily Water Goal Tracker</h2>
          <p className="text-gray-400 mb-6">
            Set your daily water usage goal and track how much you’ve used throughout the day.
          </p>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="targetInput">
              Enter your daily water goal (liters)
            </label>
            <input
              id="targetInput"
              type="number"
              min={0}
              value={tempTarget}
              onChange={handleTempTargetChange}
              className="w-full rounded-lg px-4 py-3 bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your goal"
            />
            <button
              onClick={() => {
                handleSetGoal();
                toast.success("🎯 Your goal is set!");
              }}
              className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Set Goal
            </button>
          </div>

          <h2 className="text-white text-3xl font-bold mb-4 tracking-tight">Goal Progress</h2>

          <div className="w-full h-8 rounded-full bg-[#333] overflow-hidden mb-4">
            <div
              style={{
                width: `${Math.min(percentage, 100)}%`,
                background: `linear-gradient(90deg, #00ff00, ${progressColor})`,
                height: '100%',
                transition: 'width 0.5s ease, background 0.5s ease',
                borderRadius: 'inherit',
              }}
            />
          </div>

          {percentage > 100 && (
            <div className="w-full h-2 rounded-full bg-red-700 mb-4" title="Exceeded water goal" />
          )}

          <p className={`text-center text-lg font-semibold ${color}`}>{message}</p>
        </div>

        <div className="flex-1 bg-[#121212] p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">🧾 Log Water Usage</h2>
          <p className="text-gray-400 mb-6">
            Record how much water you use for specific purposes like drinking, bathing, or washing.
          </p>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="purposeInput">
              Purpose
            </label>
            <input
              id="purposeInput"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Drinking, Bathing"
              className="w-full rounded-lg px-4 py-3 bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="amountInput">
              Amount Used (liters)
            </label>
            <input
              id="amountInput"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 5"
              className="w-full rounded-lg px-4 py-3 bg-[#222] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <button
            onClick={async () => {
              if (!purpose.trim() || !amount) {
                toast.error("🚫 Please enter all the details");
                return;
              }
              handleAddUsage();
              await OnSubmitHandler();
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            ➕ Add Water Usage
          </button>
        </div>
        
      </div>

      <div className="mt-10 bg-[#121212] p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">📋 Today's Usage History</h2>
        {usageHistory.length === 0 ? (
          <p className="text-gray-400">No usage entries yet.</p>
        ) : (
          <ul className="space-y-4">
            {usageHistory.map((entry, index) => (
              <li
                key={`${entry.id}-${index}`}
                className="flex justify-between items-center bg-[#1e1e1e] px-4 py-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{entry.purpose}</p>
                  <p className="text-gray-400 text-sm">{entry.amount} liters</p>
                </div>
                <button
  onClick={() => handleRemoveUsage(entry._id, entry.amount)}
  className="text-red-500 hover:text-red-700 font-bold"
>
  ❌ Remove
</button>

              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Calculate;
