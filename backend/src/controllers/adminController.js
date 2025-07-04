import Admin from "../models/adminModel.js";
import adminLoginSchema from "../schema/adminLoginSchema.js";
import adminSchema from "../schema/adminSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Booking from "../models/bookingModel.js";
dotenv.config();

export async function adminSignup(req, res) {
    try {
        const validatedData = adminSchema.parse(req.body);
        const {username, email, password, profilePic} = validatedData;
        //check if the email already exists
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({msg:"Email already exists"});
        }
        //create and save new admin
        const admin = await Admin.create({username, email, password, profilePic});

        return res.status(201).json({
            msg:"Admin created successfully",
            admin:{
                id: admin._id,
                username: admin.username,
                email: admin.email,
                profilePic: admin.profilePic,
            },
        });
    } catch (error) {
        if(error.name === 'ZodError'){
            return res.status(400).json({errors:error.errors});
        }
        return res.status(500).json({msg:"Internal server error: Error in signupAdmin"})
    }
}

export async function adminLogin(req, res) {
    try {
        const {email, password}= adminLoginSchema.parse(req.body);
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({msg:"Email doesn't exist"})
        }
        //matching the password with the method defined in the adminModel
        const isMatch = await admin.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({msg:"Invalid email or password"})
        }
        //Generating jwt
        const token = jwt.sign({id:admin._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        return res.status(200).json({
            msg:"Login successful",
            token,
            admin:{
                id: admin._id,
                username: admin.username,
                email: admin.email,
                profilePic: admin.profilePic,
            }
        })
        
    } catch (error) {
        if (error.name === "ZodError") {
        return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ msg: "Internal server error: Error in adminLogin" });
    }
}

export async function adminDashboard(req, res) {
    try {
        //return total no. of bookings (data relative to the chart in frontend), weekly and monthly booking
        const now = new Date();

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek =    new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalBookings = await Booking.countDocuments();
        const dailyBookings = await Booking.countDocuments({createdAt:{$gte: startOfToday}});
        const weeklyBookings = await Booking.countDocuments({createdAt:{ $gte: startOfWeek}});
        const monthlyBookings = await Booking.countDocuments({ createdAt: { $gte: startOfMonth } });

        return res.status(200).json({
            totalBookings,
            dailyBookings,
            weeklyBookings,
            monthlyBookings
        })
    } catch (error) {
        res.status(500).json({msg:"Error fetching booking details; Error in adminDashboard", error:error.message})
    }
    
}

export async function getDashboardStats(req, res) {
    try {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    //WEEKLY BOOKINGS
    const weekly = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$createdAt" },
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } // Mon, Tue, etc.
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    //monthly booking
    const monthly = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    //serviceTypeDistribution
    const serviceTypeDistribution = await Booking.aggregate([
      {
        $group: {
          _id: "$serviceType",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          count: 1
        }
      }
    ]);

    return res.status(200).json({
        weekly,
        monthly,
        serviceTypeDistribution
    })

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Error generating dashboard stats: Error in getDashboardStats", error:error.message});
    }
}

export async function getAllBookings(req, res) {
    try {
        const {status, serviceType, date} = req.query;
        const filter = {};

        if(status) filter.status = status;
        if(serviceType) filter.serviceType = serviceType;
        if(date){
            const selectedDate = new Date(date);
            const nextDate = new Date(selectedDate);
            nextDate.setDate(nextDate.getDate()+1);

            filter.date = {
                $gte: selectedDate,
                $lt: nextDate
            };
        }

        const bookings = await Booking.find(filter).sort({createdAt: -1});
        return res.status(200).json({bookings});
    } catch (error) {
        return res.status(500).json({msg:"Error fetching bookings: Error in getAllBookings", error:error.message})
    }
    
}