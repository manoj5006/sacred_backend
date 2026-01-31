const express = require('express');
const dotenv = require('dotenv');
require('./framing/storage');
const AdminRoute = require('./bridge/adminRoute');
const UserRoute = require('./bridge/userRoute');
const cors =require('cors')

  
dotenv.config();

const app = express();
app.use(cors({
  origin: ['https://scaredadmin.msixtechnologies.com','https://sacredtokens.msixtechnologies.com','http://localhost:4200','http://localhost:4500'],  
  methods: ['GET', 'POST'],        
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}));

app.use(express.json());

const initializeServer = async () => {
  
  // Routes
  app.use('/admin',AdminRoute);
  app.use('/user',UserRoute);


  const PORT = process.env.PORT || 3000;
  console.log(PORT, "===========>PORT");

  app.listen(PORT, async() => {
    try{
    console.log(`Server running on port ${PORT}`);
    }catch(error){
      console.log("error" , error)
    }
  });
};

initializeServer();
