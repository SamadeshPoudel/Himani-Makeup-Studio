import express from "express";
import bookingRoute from "./routes/bookingRoute.js";
import adminRoutes from './routes/adminRoutes.js'
const app = express();
const PORT=3000;
import { connectDB } from "./db/dbConfig.js";

app.use(express.json());

app.use('/api',bookingRoute)
app.use('/api',adminRoutes)

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
    connectDB();
})