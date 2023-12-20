import { Router } from "express";
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Importa el modelo User adecuadamente

const router = Router();

router.post('/register', passport.authenticate('register', {
    passReqToCallback: true,
    session: false,
    failureRedirect: '/session/failedRegister',
    failureMessage: true
}), (req, res) => {
    res.status(200).json({ status: 'success', message: 'User registered', payload: req.user._id });
});

router.post('/login', passport.authenticate('login', {
    passReqToCallback: true,
    session: false,
    failureRedirect: '/session/failedLogin',
    failureMessage: true
}), (req, res) => {
    const user = {
        id: req.user._id,
        name: `${req.user.first_name}`
    };

    const token = jwt.sign(user, 'secret', { expiresIn: '1h' });
    res.cookie('cookie', token, { maxAge: 3600000, httpOnly: true });
    res.status(200).json({ status: 'success', payload: user });
});

router.get('/current', async (req, res) => {
    const token = req.cookies.cookie;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token found' });
    }

    jwt.verify(token, 'secret', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'error', message: 'Failed to authenticate token' });
        }

        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }

            res.status(200).json({ status: 'success', payload: user });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    });
});

export default router;
