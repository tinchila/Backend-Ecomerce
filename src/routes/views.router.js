import express from 'express';
import * as viewsController from '../controllers/viewsController.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/register', (req, res) => {
    logger.debug('Rendering register view');
    viewsController.renderRegisterView(req, res);
});

router.post('/register', (req, res) => {
    logger.debug('Attempting to register user');
    viewsController.registerUser(req, res);
});

router.get('/', (req, res) => {
    logger.debug('Rendering users view');
    viewsController.renderUsersView(req, res);
});

router.get('/cart', (req, res) => {
    logger.debug('Rendering cart view');
    viewsController.renderCartView(req, res);
});

export default router;
