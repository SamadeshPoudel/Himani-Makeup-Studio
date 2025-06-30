import Booking from "../models/bookingModel.js";
import bookingSchema from "../schema/bookingSchema.js";

export async function createBooking(req, res) {
    try {
    const validatedData = bookingSchema.parse(req.body);
    //saving to database
    const booking = new Booking(validatedData);
    await booking.save();

    res.status(201).json({
        msg:"Booking created successfully",
        booking,
    })
    } catch (error) {
        //throws zod error if zod validation fails
        if(error.name === 'ZodError'){
            return res.status(400).json({
                error:"validation failed",
                error:error.errors,
            })
        }
        //else database error
        console.error("Error creating booking:", error);
        res.status(500).json({msg:"Internal server error: Error in createBooking"})
    }

}