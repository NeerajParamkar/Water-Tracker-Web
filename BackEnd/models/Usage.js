import mongoose from "mongoose";

const usageEntrySchema = new mongoose.Schema({
  purpose: String,
  amount: Number,
  goal: Number,
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString()
  }
});

const dailyUsageSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true 
  },
  usages: [usageEntrySchema]
});

const usageModule = mongoose.models.DailyUsage || mongoose.model("DailyUsage", dailyUsageSchema);

export default usageModule;
