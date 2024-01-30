import Courses from '../dao/dbManagers/cart.js';
import userModel from '../dao/models/users.js';
import createHash from '../utils.js';
import Logger from '../utils/logger.js';

const coursesManager = new Courses();

export const getAllCourses = async (req, res) => {
    try {
        let courses = await coursesManager.getAll();
        Logger.info('All courses retrieved successfully');
        res.send({ status: 'success', payload: courses });
    } catch (error) {
        Logger.error('Internal Server Error', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, birthDate, gender, dni, email, password } = req.body;

        if (!first_name || !last_name || !birthDate || !gender || !dni || !email || !password) {
            Logger.error('Incomplete data');
            return res.status(400).send({ status: 'error', error: 'Incomplete data' });
        }

        const hashedPassword = await createHash(password);

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            dni,
            birthDate,
            gender,
            password: hashedPassword
        });

        await newUser.save();
        Logger.info('User registered successfully');
        res.send({ status: 'success', payload: newUser });

    } catch (error) {
        Logger.error('Internal Server Error', error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
};
