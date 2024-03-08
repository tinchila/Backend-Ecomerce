
import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import { isAuthenticated } from '../middleware/authorization.js';

const router = express.Router();

router.post('/', isAuthenticated, createOrder);

export default router;
