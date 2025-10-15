import express from "express";

const app = express()

app.listen(3001,()=>console.log("express backend"))

app.get("/",(req,res)=>res.send("hello from express backend"))
