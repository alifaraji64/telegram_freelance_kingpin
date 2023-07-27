import mongoose from "mongoose";

export const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true,
        maxLength:200
    },
    banner:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required: true
    }
})