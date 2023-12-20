import { Router } from "express";
import Cart from "../dao/dbManagers/cart.js";
import Users from "../dao/dbManagers/users.js";

const cartManager = new Cart();
const userManager = new Users();

const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password
        };

        await userManager.saveUser(newUser);
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
});

router.get('/', async (req, res) => {
    let users = await userManager.getAll();
    console.log(users);
    res.render('users', { users });
});

router.get('/cart', async (req, res) => {
    let cartProducts = await cartManager.getCartProducts();
    console.log(cartProducts);
    res.render('cart', { cartProducts });
});

export default router;
