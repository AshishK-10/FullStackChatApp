const express = require('express')
const dotenv = require("dotenv")
const {chats} = require('./data/data')
const cors = require('cors')
const connectDb = require('./config/db')
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const app = express();

dotenv.config();
connectDb(); //connected db

app.use(express.json());
app.use(cors());
app.use(express.json()); // to accept the json data

app.use('/api/user', userRoutes) // /api/user routes
app.use('/api/chat', chatRoutes) // api/chat routes
app.use('/api/message', messageRoutes) // api/message routes
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000;
app.listen(5000, console.log(`server started on port ${port}`.yellow.bold))
