const express=require("express")
const app=express()
const cors=require("cors")
const mongoose=require("mongoose")
const userRoute=require("./routes/user")
const todeRoute=require("./routes/todo")
const authenticateToken = require("./middlewares/user")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected")
})

mongoose.connection.on("error", ()=>{
    console.log("db connection failed")
})

app.use(cors())
app.use(express.json())

app.use("/user", userRoute)
app.use("/todo", authenticateToken, todeRoute)

app.get("/",(req, res)=>{
    return res.json({"message": "alive"})
})

app.listen(8000, ()=>{
    console.log("server is listening on port 8000")
})