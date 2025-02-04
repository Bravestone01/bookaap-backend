import { Book } from "../models/book.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

const createBook = asyncHandler(async (req, res,) => {

    const { title, author, price, description, image } = req.body;
    console.log(req.body);
    
    if (!title || !author || !price || !description) {
        throw new ApiError(400, "please enter book full details");

    }
    if (!req.user) {
        throw new ApiError(401, "Unauthorized: User not logged in");
    }

    const exitingBook = await Book.findOne({ title });
    if (exitingBook) {
        throw new ApiError(400, "Book already exists");

    }

    const imageLocalpath = req.file?.path;
    console.log("uplod",imageLocalpath);
    

    if (!imageLocalpath) {
        throw new ApiError(400, "Please upload book image");
    }

    const bookImage = await uploadCloudinary(imageLocalpath);
    if (!bookImage) {
        throw new ApiError(500, "Book image upload failed try again");
    }

    const book = await Book.create({
        title,
        author,
        price,
        description,
        image: bookImage.url,
        user: req.user._id
    });
    const createBook = await Book.findById(book._id);
    if (!createBook) {
        throw new ApiError(500, "Book not created");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createBook, "Book created successfully"));
})

// get all books 
 
const getAllBooks = asyncHandler(async (req, res) => {
    const books = await Book.find().populate("user", "fullname email");
    return res
        .status(200)
        .json(new ApiResponse(200, books, "All books fetched successfully"));
});

// delete book
const deleteBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, book, "Book deleted successfully"));
});

// update book details
const updateBookDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, author, price, description ,} = req.body;
    const imageLocalpath = req.file?.path;

   
   
    const book = await Book.findById(id);
    if (!book) {
        throw new ApiError(400,"book not found");  
    }

    const updateData ={};
    if (title) {
        updateData.title = title;
    }
    if (author) {
        updateData.author = author;
    }
    if (price) {
        updateData.price = price;
    }
    if (description) {
        updateData.description = description;
    }
    if (imageLocalpath) {
        const bookImage = await uploadCloudinary(imageLocalpath);
        if (!bookImage) {
            throw new ApiError(500, "Image upload failed. Please try again");
        }
        updateData.image = bookImage.url;
    }
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});








export { createBook , getAllBooks, deleteBook, updateBookDetails };