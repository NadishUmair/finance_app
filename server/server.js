const express=require("express");
const PORT=process.env.PORT || 5000;
const connectgDB = require("./database");
const authRoutes=require("./routes/authRoutes")
const app= express();
const cors=require('cors');
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("App is running")
})

connectgDB();
app.use('/api/auth',authRoutes);
app.listen(PORT,()=>{
    console.log("app is running at",PORT)
})
