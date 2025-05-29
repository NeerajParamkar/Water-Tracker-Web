import express from "express"

const app=express();

app.get('/',(req,res)=>{
  res.send("hello their");
})

app.listen(3000)