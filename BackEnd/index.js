import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import usageModule from "./models/usage.js";
const app=express();


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

    res.send("Registered with updated goal");
  } catch (error) {
    console.error("Error saving usage data:", error);
    res.status(500).send("Internal Server Error");
  }
});


const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log("Your app is live")
})