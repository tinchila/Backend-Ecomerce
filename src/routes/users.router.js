import express from 'express';
import * as usersController from '../controllers/usersController.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        logger.debug('Getting all users');
        await usersController.getAllUsers(req, res);
    } catch (error) {
        logger.error('Error while getting all users', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        logger.debug('Attempting to register user');
        await usersController.registerUser(req, res);
    } catch (error) {
        logger.error('Error while registering user', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

router.put('/premium/:uid', async (req, res) => {
    try {
        logger.debug('Changing user role');
        await usersController.changeUserRole(req, res);
    } catch (error) {
        logger.error('Error while changing user role', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

export default router;
