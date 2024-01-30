import express from 'express';
import * as sessionController from '../controllers/sessionController.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        logger.debug('Attempting to register user');
        await sessionController.registerUser(req, res);
    } catch (error) {
        logger.error('Error while registering user', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        logger.debug('Attempting to login user');
        await sessionController.loginUser(req, res);
    } catch (error) {
        logger.error('Error while logging in user', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

router.get('/current', async (req, res) => {
    try {
        logger.debug('Getting current user');
        await sessionController.getCurrentUser(req, res);
    } catch (error) {
        logger.error('Error while getting current user', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

router.post('/admin/endpoint', sessionController.isAdmin, async (req, res) => {
    try {
        logger.debug('Accessing admin endpoint');
        await sessionController.adminEndpoint(req, res);
    } catch (error) {
        logger.error('Error while accessing admin endpoint', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

export default router;
