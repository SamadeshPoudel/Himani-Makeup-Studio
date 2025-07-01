import { z } from "zod";

const adminSchema = z.object({
    username:z
    .string({required_error:"Username is required"})
    .trim()
    .min(2,{msg:"Username must be atleast 2 characters"})
    .max(50,{msg:"Username cant exceed 50 characters"}),

    email:z
    .string({required_error:"Email is required"})
    .trim()
    .toLowerCase()
    .email({msg:"Invalid email format"}),

    password:z
    .string({required_error:"Password is required"})
    .trim()
    .min(6,{msg:"Password must be atleast 6 characters long"})
    .max(12,{msg:"Password cannot be more than 12 characters long"}),

    profilePic:z
    .string()
})  

export default adminSchema;