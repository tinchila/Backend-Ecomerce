import passport from "passport";
import local from 'passport-local';
import User from '../models/User.js';
import { createHash, validatePassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = async () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        session: false
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;

            if (!first_name || !last_name || !age)
                return done(null, false);

            const exist = await User.findOne({ email });
            if (exist)
                return done(null, false);

            const hashedPassword = await createHash(password);

            const newUser = new User({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                role: 'user'
            });

            await newUser.save();
            return done(null, newUser);

        } catch (error) {
            done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        session: false
    }, async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user || !(await validatePassword(user, password)))
                return done(null, false);

            return done(null, user);

        } catch (error) {
            done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
