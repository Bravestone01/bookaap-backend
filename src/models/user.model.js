import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from 'bcrypt'; 

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true
    }


}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
export const User = mongoose.model("User", userSchema);