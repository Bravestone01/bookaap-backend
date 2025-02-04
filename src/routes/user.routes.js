import express from 'express';
import { createUser, loginUser, logoutUser , updateUser } from '../controllers/user.controller.js'; 

const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/update/:id', updateUser);

export default router;
