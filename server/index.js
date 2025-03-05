import express from "express";
import dotenv from "dotenv"
import DBcon from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";

dotenv.config()

const app =express()
const PORT = process.env.PORT || 8000

DBcon()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello from classroom backend")
})

app.use('/auth',AuthRoutes)



app.listen(PORT,()=>{
    console.log(`App is Running on the Port ${PORT}`)
})