
import ShoppingCart from "../dao/models/ShoppingCart.js";
import userModel from '../dao/models/users.js';

export const renderRegisterView = (req, res) => {
    res.render('register');
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password
        });

        await newUser.save();
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el usuario');
    }
};

export const renderUsersView = async (req, res) => {
    try {
        const users = await userModel.find();
        console.log(users);
        res.render('users', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

export const renderCartView = async (req, res) => {
    try {
        const userId = req.userId;

        const cart = await ShoppingCart.findOne({ userId }).populate('products');
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Cart not found" });
        }

        res.status(200).render("cart", { cartProducts: cart.products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error at loading the cart');
    }
};
