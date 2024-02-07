import express from 'express';
import { sendRecoveryEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/recover', sendRecoveryEmail);

export default router;
