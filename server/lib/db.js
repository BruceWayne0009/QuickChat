import mongoose from "mongoose";

//function to connect to the mongoDB database
export const connectDB = async () => {
    try{

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
        })

        await mongoose.connect(`${process.env.MONGO_URI}/quickchat`)
    } catch (error) {
        console.log(error);
    }
}