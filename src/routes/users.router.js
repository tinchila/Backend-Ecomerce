import { Router } from 'express';
import Courses from '../dao/dbManagers/cart.js';
import { userModel } from '../dao/models/users.js';
import { createHash } from '../utils.js';

const router = Router();
const coursesManager = new Courses();

router.get('/', async (req, res) => {
    let courses = await coursesManager.getAll();
    res.send({ status: "success", payload: courses });
});

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, birthDate, gender, dni, email, password } = req.body;

        if (!first_name || !last_name || !birthDate || !gender || !dni || !email || !password)
            return res.status(400).send({ status: 'error', error: 'Incomplete' });

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
        res.send({ status: "success", payload: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
});

export default router;
