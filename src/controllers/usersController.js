import userModel from '../dao/models/users.js';
import createHash from '../utils/utils.js';
import Logger from '../utils/logger.js';
import MailService from '../services/mailService';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        Logger.error(`Error getting all users: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, birthDate, gender, dni, email, password } = req.body;

        if (!first_name || !last_name || !birthDate || !gender || !dni || !email || !password) {
            Logger.error('Incomplete data');
            errorHandler(errorDictionary.INCOMPLETE_DATA, res);
            return;
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
        await MailService.sendMail(
            email,
            "Welcome to our platform",
            `<b>Hello ${first_name},</b><br><p>Thank you for registering. Welcome aboard!</p>`
        );
        Logger.info('User registered successfully');
        res.status(201).json({ status: 'success', payload: newUser });

    } catch (error) {
        Logger.error(`Error registering user: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;

        if (!uid || !newRole || !['user', 'premium'].includes(newRole)) {
            Logger.error('Invalid parameters for changing user role');
            errorHandler(errorDictionary.INVALID_PARAMETERS, res);
            return;
        }

        const user = await userModel.findById(uid);

        if (!user) {
            Logger.error(`User not found with ID: ${uid}`);
            errorHandler(errorDictionary.USER_NOT_FOUND, res);
            return;
        }

        if (req.user.role !== 'admin' && req.user._id.toString() !== uid) {
            Logger.error('Unauthorized to change user role');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        user.role = newRole;
        await user.save();

        Logger.info(`User role changed successfully: ${user.email}`);
        res.status(200).json({ status: 'success', message: 'User role changed successfully', payload: user });
    } catch (error) {
        Logger.error(`Error changing user role: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};
