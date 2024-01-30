import express from 'express';
import * as usersController from '../controllers/usersController.js';
import logger from '../utils/logger.js'; // Asegúrate de tener la ruta correcta al archivo logger.js

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        logger.debug('Getting all courses');
        await usersController.getAllCourses(req, res);
    } catch (error) {
        logger.error('Error while getting all courses', error);
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

export default router;
