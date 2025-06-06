import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import usageModule from "./models/usage.js";
const app=express();


app.use(cors({origin:'http://localhost:5173',credentials:true}));
connectDB(); //Database connected/
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.get('/',(req,res)=>{
  res.send("Hello their");
})

app.post('/data', async (req, res) => {
  try {
    const { purpose, amount, goal } = req.body;
    const today = new Date().toISOString().split('T')[0];

    let usageDoc = await usageModule.findOne({ date: today });

    if (usageDoc) {
      usageDoc.usages = usageDoc.usages.map(entry => ({
        ...entry.toObject(),
        goal             
      }));

      usageDoc.usages.push({
        purpose,
        amount,
        goal
      });

      await usageDoc.save();
    } else {
      usageDoc = await usageModule.create({
        date: today,
        usages: [{
          purpose,
          amount,
          goal
        }]
      });
    }

    res.json({ message: "Usage added", success: true });
  } catch (error) {
    res.json({ message: "Please Enter All the Data", success: false });
  }
});

app.get('/dailyusage', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    const dailyUsage = await usageModule.findOne({ date });

    if (!dailyUsage) {
      return res.json({ success: false, message: "No usage data for this date" });
    }

    res.json({
      success: true,
      data: dailyUsage.usages,
      totalAmount:dailyUsage.totalAmount
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.delete('/delete-usage', async (req, res) => {
  const { id } = req.body;

  try {
    const today = new Date().toLocaleDateString('en-CA');

    // Find today's record
    const usageDoc = await usageModule.findOne({ date: today });
    if (!usageDoc) {
      return res.status(404).json({ success: false, message: "No data for today." });
    }

    // Filter the usages array
    const newUsages = usageDoc.usages.filter((item) => item._id.toString() !== id);

    usageDoc.usages = newUsages;

    // Recalculate total
    usageDoc.totalAmount = newUsages.reduce((sum, item) => sum + item.amount, 0);
    await usageDoc.save();

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log("Your app is live")
})