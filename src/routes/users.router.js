import { Router } from 'express';
import Courses from '../dao/dbManagers/courses.js';
import Users from '../dao/dbManagers/users.js';

const userManager = new Users()

const router = Router();
const coursesManager = new Courses();

router.get('/',async(req,res)=>{
    let courses = await coursesManager.getAll();
    res.send({status:"success",payload:courses})
})

router.post('/',async(req,res)=>{
    let {first_name, last_name, birthDate, gender, dni, email, password} = req.body
    if (!first_name || !last_name || !birthDate || !gender || !dni || !email || !password)
    return res.status(400).send ({status: 'error', error: 'Incomplete'})

    let result = await userManager.saveUser({
        first_name,
        last_name,
        email,
        dni,
        birthDate,
        gender,
        password
    })
    res.send({status:"success",payload:result});
})

export default router;