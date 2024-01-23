
import express from 'express';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/', usersController.getAllCourses);
router.post('/register', usersController.registerUser);

export default router;
