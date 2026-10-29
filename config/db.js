const mongoose = require('mongoose');

const connectDB=async()=>{
    const MONGO_URI= process.env.MONGO_URI;

    if (!MONGO_URI){
        console.error('Error: No MONGO_URL is defined in your environment(.env)')
        process.exit(1);
    }

    try{
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB successfully');
    }catch(err){
        console.error('Failed to connect to MondoDB:',err.message);
        process.exit(1);
    }
};

module.exports=connectDB;