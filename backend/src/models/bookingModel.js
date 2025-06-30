import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time: {
    type: String,
    required: true,
    validate: {
        validator: function(v) {
            return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)?$/i.test(v);
        },
        message: 'Time must be in format HH:MM or HH:MM AM/PM'
    }
}
},{
    timestamps:true
})

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;