import express from "express";
import dotenv from "dotenv"
import DBcon from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import ClassRoutes from "./routes/Class.js";
import OTPRoutes from "./routes/otp.js";
import AttendanceRoutes from "./routes/attendance.js";
import cors from 'cors'

dotenv.config()

const app =express()
const PORT = process.env.PORT || 8000

DBcon()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173"
}));


app.get("/",(req,res)=>{
    res.send("Hello from classroom backend")
})

app.use('/auth',AuthRoutes)
app.use('/class',ClassRoutes)
app.use('/otp',OTPRoutes)
app.use('/attendance',AttendanceRoutes)

// app.use("/api", router);

app.listen(PORT,()=>{
    console.log(`App is Running on the Port ${PORT}`)
})