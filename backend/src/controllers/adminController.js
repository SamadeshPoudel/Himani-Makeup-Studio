import Admin from "../models/adminModel.js";
import adminLoginSchema from "../schema/adminLoginSchema.js";
import adminSchema from "../schema/adminSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
        const token = jwt.sign({id:admin._id}, process.env.JWT_SECRET, {expiresIn:"24h"});

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