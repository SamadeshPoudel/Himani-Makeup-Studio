import express from "express";
import bookingRoute from "./routes/bookingRoute.js";
const app = express();
const PORT=3000;
import { connectDB } from "./db/dbConfig.js";

app.use(express.json());

app.use('/api',bookingRoute)

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
    connectDB();
})