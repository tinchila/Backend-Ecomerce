import { Router } from "express";
import ShoppingCart from "../dao/models/ShoppingCart.js"; // Importa el modelo ShoppingCart

const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Crea un nuevo usuario con los datos proporcionados
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password
        });

        // Guarda el nuevo usuario en la base de datos
        await newUser.save();
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        console.log(users);
        res.render('users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los usuarios');
    }
});

router.get('/cart', async (req, res) => {
    try {
        const userId = req.userId; // Supongo que tienes esta propiedad userId definida en otro lugar

        const cart = await ShoppingCart.findOne({ userId }).populate('products');
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Cart not found" });
        }

        res.status(200).render("cart", { cartProducts: cart.products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error at loading the cart');
    }
});

export default router;
