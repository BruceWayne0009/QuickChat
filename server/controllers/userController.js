import User from "../models/User";
import bcrypt from 'bcrypt';

//Signup a new User

import User from "../models/User";
import { generateToken } from "../lib/utils";

export const signup = async (req, res) => {
    const { fullName , email , password , bio } = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message: 'Missing details'})
        }

        const user = await User.findOne({email});
        if(user){
            return res.json({success:false, message: 'User already exists'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            email, fullName, password: hashed, bio
        });

        const token = generateToken(newUser._id);

        res.json({success:true, userData : newUser, token, message : 'Account Created Successfully'});

    } catch(error){
        console.log(error.message);
        res.json({success:false, message : error.message});
    }
}

//controller for loggin in a user
 export const login = async (req, res) => {
    try{
        const {  email , password } = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({success:false, message: 'Invalid Credentials'});
        }

        const token = generateToken(userData._id);

        res.json({success:true, userData : newUser, token, message : 'Login successful'});
    } catch(error){
        console.log(error.message);
        res.json({success:false, message : error.message});
    }
 }