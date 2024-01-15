import { Router } from 'express';
import { authorize } from '../middleware/authorization.js';
import { Product } from '../dao/models/product.js';
import { ShoppingCart } from '../dao/models/ShoppingCart.js';
import { cartModel } from '../dao/models/ShoppingCart.js';
import { productModel } from '../dao/models/product.js';
import Ticket from '../dao/models/ticket.js';
import TicketService from '../services/ticketService.js';

const router = Router();
const ticketService = new TicketService();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.post('/', authorize(['admin']), async (req, res) => {
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

router.post('/addToCart', authorize(['user']), async (req, res) => {
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

router.post('/:cid/purchase', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartModel.findById(cartId).populate('products');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        const ticketProducts = [];

        for (const cartProduct of cart.products) {
            const product = await productModel.findById(cartProduct._id);

            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found' });
            }

            if (product.stock >= cartProduct.quantity) {
                product.stock -= cartProduct.quantity;
                await product.save();

                ticketProducts.push({
                    product: product.title,
                    quantity: cartProduct.quantity,
                    price: product.price,
                });
            } else {
                console.log("Producto sin suficiente stock, no se agrega al proceso de compra");
            }
        }

        const ticket = new Ticket({
            code: generateUniqueCode(),
            amount: calculateTotalAmount(ticketProducts),
            purchaser: req.user.email,
        });

        await ticket.save();

        const remainingProducts = cart.products.filter((cartProduct) =>
            ticketProducts.some(
                (ticketProduct) => ticketProduct.product === cartProduct._id.toString()
            )
        );

        cart.products = remainingProducts;
        await cart.save();

        const ticketService = new TicketService();

        const ticketResult = await ticketService.createTicket({
            amount: calculateTotalAmount(ticketProducts),
            purchaser: req.user.email,
            products: ticketProducts,
        });

        const remainingProductsAfterPurchase = cart.products.filter((cartProduct) =>
            ticketResult.products.some(
                (ticketProduct) => ticketProduct.product === cartProduct._id.toString()
            )
        );

        cart.products = remainingProductsAfterPurchase;
        await cart.save();

        return res.status(200).json({
            status: 'success',
            message: 'Purchase completed successfully',
            ticket: ticketResult,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


export default router;
