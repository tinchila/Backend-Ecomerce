import Product from '../dao/models/product.js';
import ShoppingCart from '../dao/models/ShoppingCart.js';
import cartModel from '../dao/models/ShoppingCart.js';
import productModel from '../dao/models/product.js';
import TicketService from '../services/ticketService.js';
import Logger from '../utils/logger.js';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        Logger.error(`Error getting all products: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            Logger.error('Incomplete data provided for creating product');
            errorHandler(errorDictionary.INCOMPLETE_DATA, res);
            return;
        }

        const newProduct = new Product({
            title,
            description,
            price,
        });

        await newProduct.save();
        Logger.info(`Product added successfully: ${newProduct}`);
        res.status(201).json({ status: "success", message: "Product added successfully", payload: newProduct });
    } catch (error) {
        Logger.error(`Error creating product: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            Logger.error(`Product not found with ID: ${productId}`);
            errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
            return;
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

        Logger.info(`Product added to cart: ${product.title}`);
        res.status(200).json({ status: "success", message: "Product added to cart", payload: cart });
    } catch (error) {
        Logger.error(`Error adding product to cart: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products');

        if (!cart) {
            Logger.error(`Cart not found with ID: ${cartId}`);
            errorHandler(errorDictionary.CART_NOT_FOUND, res);
            return;
        }

        const ticketProducts = [];

        for (const cartProduct of cart.products) {
            const product = await productModel.findById(cartProduct._id);

            if (!product) {
                Logger.error(`Product not found with ID: ${cartProduct._id}`);
                errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
                return;
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
                Logger.error(`Insufficient stock for product: ${product.title}`);
                errorHandler(errorDictionary.INSUFFICIENT_STOCK, res);
                return;
            }
        }

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

        Logger.info(`Purchase completed successfully: ${ticketResult}`);
        return res.status(200).json({
            status: 'success',
            message: 'Purchase completed successfully',
            ticket: ticketResult,
        });
    } catch (error) {
        Logger.error(`Error processing purchase: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

function calculateTotalAmount(products) {
    return products.reduce((total, product) => total + product.quantity * product.price, 0);
};

export const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
