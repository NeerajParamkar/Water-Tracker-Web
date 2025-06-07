import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import usageModule from './models/usage.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello there');
});

// POST /data - Add or update today's water usage
app.post('/data', async (req, res) => {
  try {
    const { purpose, amount, goal, time } = req.body;
    if (!purpose || amount === undefined || goal === undefined) {
      return res.status(400).json({ message: 'Missing required fields', success: false });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let usageDoc = await usageModule.findOne({ date: today });

    if (usageDoc) {
      // Update goal for all usages
      usageDoc.usages = usageDoc.usages.map((entry) => ({
        ...entry.toObject(),
        goal,
      }));

      // Add new usage entry
      usageDoc.usages.push({ purpose, amount, goal, time });

      // Recalculate totalAmount
      usageDoc.totalAmount = usageDoc.usages.reduce((sum, u) => sum + u.amount, 0);

      await usageDoc.save();
    } else {
      // Create new document for today
      usageDoc = await usageModule.create({
        date: today,
        usages: [{ purpose, amount, goal, time }],
        totalAmount: amount,
      });
    }

    res.json({ message: 'Usage added', success: true });
  } catch (error) {
    console.error('POST /data error:', error);
    res.status(500).json({ message: 'Server error', success: false });
  }
});

// GET /dailyusage?date=YYYY-MM-DD - Fetch usage for a specific date
app.get('/dailyusage', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const dailyUsage = await usageModule.findOne({ date });

    if (!dailyUsage) {
      return res.json({ success: false, message: 'No usage data for this date' });
    }

    res.json({
      success: true,
      data: dailyUsage.usages,
      totalAmount: dailyUsage.totalAmount,
    });
  } catch (error) {
    console.error('GET /dailyusage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /delete-usage - Delete a usage entry by its id (from usages array)
app.delete('/delete-usage', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Usage ID is required' });
    }

    const today = new Date().toISOString().split('T')[0];
    const usageDoc = await usageModule.findOne({ date: today });
    if (!usageDoc) {
      return res.status(404).json({ success: false, message: 'No data for today.' });
    }

    usageDoc.usages = usageDoc.usages.filter((item) => item._id.toString() !== id);
    usageDoc.totalAmount = usageDoc.usages.reduce((sum, item) => sum + item.amount, 0);

    await usageDoc.save();

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /delete-usage error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to get ISO week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// GET /api/water-usage-hierarchy - Return hierarchical water usage data (year > month > week > day)
app.get('/api/water-usage-hierarchy', async (req, res) => {
  try {
    const docs = await usageModule.find();

    const hierarchy = {};

    docs.forEach((doc) => {
      const date = new Date(doc.date);
      if (isNaN(date.getTime())) return; // skip invalid dates

      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      const week = getWeekNumber(date);
      const day = date.getDate().toString();

      const dayTotal = doc.usages.reduce((sum, usage) => sum + usage.amount, 0);

      hierarchy[year] ??= {};
      hierarchy[year][month] ??= { weeks: {} };
      hierarchy[year][month].weeks[week] ??= { days: {} };
      hierarchy[year][month].weeks[week].days[day] ??= 0;

      hierarchy[year][month].weeks[week].days[day] += dayTotal;
    });

    res.json({ success: true, data: hierarchy });
  } catch (error) {
    console.error('GET /api/water-usage-hierarchy error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
