import express from 'express';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/', usersController.getAllUsers);
router.post('/register', usersController.registerUser);
router.put('/premium/:uid', usersController.changeUserRole);

export default router;
