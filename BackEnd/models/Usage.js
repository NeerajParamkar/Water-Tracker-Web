import mongoose from "mongoose";

const usageEntrySchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
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
  usages: [usageEntrySchema],
  totalAmount: {
    type: Number,
    default: 0
  }
});

dailyUsageSchema.pre('save', function(next) {
  this.totalAmount = this.usages.reduce((sum, usage) => sum + usage.amount, 0);
  next();
});

const usageModule = mongoose.models.DailyUsage || mongoose.model("DailyUsage", dailyUsageSchema);

export default usageModule;
