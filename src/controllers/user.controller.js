import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const createUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { fullname, username, password, email } = req.body;
  
    
    if (!fullname || !username || !password || !email) {
        throw new ApiError(400, "All fields are required")
    }
    const existingUser = await User.findOne({ email },);
    if (existingUser) {
        throw new ApiError(402, "user Allready Exist");
    }
    const newUser = new User({
        fullname,
        email,
        username,
        password,
    })
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, process.env.JWT_SECRET, {
        expiresIn: '1d', 
    });

    return res
    .status(200)
    .json(new ApiResponse(201 , {savedUser, token} , "userCreated Successufull"))
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    return res
        .status(200)
        .json(new ApiResponse(200, {user, token}, "login successfull"));
});


const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    return res
    .status(200)
    .json(new ApiResponse(200, null, "logout successfull"));
});

const updateUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;
    const userId = req.params.id;

    console.log("Update Request:", req.body); // Debugging

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update user fields
    if (fullname) user.fullname = fullname;
    if (username) user.username = username;
    if (email) user.email = email;
    
    // If the user wants to update their password
    if (password) {
        user.password = password; // The pre-save hook will hash it
    }

    const updatedUser = await user.save();

    return res.status(200).json(new ApiResponse(200, updatedUser,  "User updated successfully"));
});


export { createUser, loginUser , logoutUser , updateUser}