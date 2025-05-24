import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

//Signup a new User

import { generateToken } from "../lib/utils.js";

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

 //controller to check if user is authenticated
 export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
 }

 //controller to update user profile details
 export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
 }