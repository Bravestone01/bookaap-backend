import { Router } from "express";
import { createBook, getAllBooks, deleteBook ,updateBookDetails } from "../controllers/book.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/upload", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        next();
    });
}, createBook);

router.get("/allbooks", getAllBooks);
router.delete("/delete/:id", deleteBook);
router.put("/update/:id", upload.single('image'), updateBookDetails);


export default router;
