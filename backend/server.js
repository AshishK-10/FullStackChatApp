const express = require('express')
const dotenv = require("dotenv")
const {chats} = require('./data/data')
const cors = require('cors')

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.get('/api/chat', (req,res)=>{
  console.log(req)
  res.json({chats})
})

app.get('/', (req, res)=>{
  res.send("this is the server running successfully")
})



const port = process.env.PORT || 5000;
app.listen(port, ()=>{
  console.log("server started on 5000")
})
