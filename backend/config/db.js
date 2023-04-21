const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async()=>{
 try{
  const connection = await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MONGODB connected: ".blue, connection.connection.host.red.bold)
 } catch(err){
   console.log("error occured", err.message.red.bold);
 }
};

module.exports = connectDB;