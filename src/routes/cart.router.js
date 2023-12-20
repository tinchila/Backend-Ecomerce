import { Router } from "express";
import Product from "../models/product.js"; 
import ShoppingCart from "../models/ShoppingCart.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            return res.status(400).json({ status: "error", message: "Incomplete data" });
        }

        const newProduct = new Product({
            title,
            description,
            price,
        });

        await newProduct.save();
        res.status(201).json({ status: "success", message: "Product added successfully", payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.post('/addToCart', async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        let cart = await ShoppingCart.findOne({ userId });

        if (!cart) {
            cart = new ShoppingCart({
                userId,
                products: [],
            });
        }

        cart.products.push(product);
        await cart.save();

        res.status(200).json({ status: "success", message: "Product added to cart", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

export default router;
