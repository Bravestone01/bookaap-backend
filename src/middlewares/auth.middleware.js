import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    // Check if token exists in the request headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            
            next();
        } catch (error) {
            throw new ApiError(401, "Invalid or expired token, authorization denied");
        }
    } else {
        throw new ApiError(401, "No token found, authorization denied");
    }
});

export { protect };

