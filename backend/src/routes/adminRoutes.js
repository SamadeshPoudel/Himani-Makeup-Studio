import express from "express";
import { adminDashboard, adminLogin, adminSignup, getDashboardStats, getAllBookings } from "../controllers/adminController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
const router = express.Router();

router.post('/admin/signup', adminSignup)
router.post('/admin/login', adminLogin);

router.use(verifyJwt); //this middleware makes the below route require jwt verification

//dashboard routes
router.get('/admin/dashboard', adminDashboard)
router.get('/admin/dashboard/stats',getDashboardStats)

//Booking management routes
router.get('/admin/bookings', getAllBookings)
export default router;