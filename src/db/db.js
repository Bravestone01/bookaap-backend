import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
      const db =  await mongoose.connect(`${process.env.MONGO_URI}`)
      console.log(`/n Connected to MongoDB !! HOST : ${db.connection.host}`);
      
    } catch (error) {
        console.error("ERROR", error)
        process.exit(1)  
    }
}

export default connectDB;