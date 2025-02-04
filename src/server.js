import dotenv from "dotenv";
import connectDB from "./db/db.js";
import {app} from "./app.js";

dotenv.config();



connectDB()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`SERVER RUNNING ON PORT: ${process.env.PORT}`);   
    })
})
.catch((error)=>{
    console.error("MONGODB CONNECTION ERROR:", error)
}
)