
import Router from 'express';
import generateMockProducts from '../controllers/mockingController.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
  const mockProducts = generateMockProducts();
  res.status(200).json({ status: 'success', payload: mockProducts });
});

export default router;
