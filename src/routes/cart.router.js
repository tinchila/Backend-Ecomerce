
import express from 'express';
import authorize from '../middleware/authorization.js';
import * as cartController from '../controllers/cartController.js';

const router = express


router.get('/', cartController.getAllProducts);
router.post('/', authorize(['admin']), cartController.createProduct);
router.post('/addToCart', authorize(['user']), cartController.addToCart);

export default router;
