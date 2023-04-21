const express = require('express')
const dotenv = require("dotenv")
const {chats} = require('./data/data')
const cors = require('cors')
const connectDb = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')

const app = express();
dotenv.config();
connectDb(); //connected db

app.use(express.json());
app.use(cors());
app.use(express.json()); // to accept the json data

app.use('/api/user', userRoutes) // /api/user routes

app.get('/api/chat', (req,res)=>{
  res.json({chats})
})

app.get('/', (req, res)=>{
  res.send("this is the server running successfully")
})


const port = process.env.PORT || 5000;
app.listen(5000, console.log(`server started on port ${port}`.yellow.bold))
