import { z } from "zod";

const bookingSchema = z.object({
    name:z
    .string({required_error:"Name is required"})
    .trim()
    .min(2,{msg:"Name must be at least 2 character!"})
    .max(50,{msg:"Name must not be more than 50 characters!"}),

    email:z
    .string({required_error:"Email is required"})
    .trim()
    .toLowerCase()
    .email({msg:"Invalid email format"}),

    phone:z
    .string({required_error:"Phone number is required"})
    .min(10, {msg:"Phone number must be at least 10 digit"})
    .max(10,{msg:"Phone number must not be more than 10 digit"}),

    date:z
    .string({required_error:"Date is required!"}),

    time:z
    .string({required_error:"Time is required"})
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/i, {
        message: "Time must be in format HH:MM or HH:MM AM/PM"
    })
})
export default bookingSchema;