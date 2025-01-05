require("dotenv").config();
const mongoose = require('mongoose');
const connectDb = require("./config/db");
const express= require('express');
const app = express();
const expenseRoute = require("./route/expenseRoute");
const userRoute = require("./route/userRoute");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require("./middleware/errorMiddleware");
const PORT = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})

app.use(cors({
  origin: [process.env.FRONTEND_URL], 
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
}))

app.use("/expense", expenseRoute); 
app.use("/user", userRoute); 

app.get('/',(req, res) => console.log("Hello world"))

connectDb();
app.use(errorHandler);
mongoose.connection.once("open", () =>{
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))  
})
