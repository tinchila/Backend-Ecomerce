import passport from "passport";
import local from 'passport-local';
import User from '../dao/dbManagers/users.js';
import { createHast, isValidatePassword } from "../utils.js";
import { disconnect } from "mongoose";

const LocalStrategy = local.Strategy
const userService = new User();

const initializePassport = async() => {

    passport.use('register', new LocalStrategy({ passReqToCallback : true ,
                                                usernameField: 'email' , 
                                                session : false}, async(req, email, password, done) => {

                                                    try{
                                                        const { first_name, last_name, birthDate, gender, dni } = req.body

                                                        if (!first_name || !last_name || !birthDate || !gender || !dni)
                                                        return done( null, false, { message: 'Incomplete Values'})
                                                        const exist = await userService.getById({email:email})
                                                        if(exist)
                                                        return done (null, false, { message: 'User email already exists'})

                                                        const hastPassword = await createHast(password)

                                                        const newUser = {
                                                            first_name,
                                                            last_name,
                                                            email,
                                                            birthDate,
                                                            gender,
                                                            dni,
                                                            password: hastPassword
                                                        }
                                                        let result = await userService.saveUser(newUser)
                                                        return done(null, result)

                                                    }
                                                    catch(error){done(error)}
                                                }
                                                ))


    passport.use ('login', new LocalStrategy({passReqToCallback : true,
                                            usernameField: 'email',
                                            session: false}, async( email, password, done) =>{
                                                try{
                                                    const user = await userService.getById({email})
                                                    const validatePassword = await isValidatePassword(user, password)
                                                    if(!validatePassword)
                                                        return done(null, false)
                                                    return done(null, user)
                                                }
                                                catch(error){done(error)}                                               
                                            }
                                            ))                                           

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })                   
    
    passport.deserializeUser(async (id,done) => {
        let result = await userService.getById({_id:id})
        return done(null, result)
    })
    
}

export default initializePassport
