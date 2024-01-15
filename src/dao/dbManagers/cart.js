import productModel from "../models/product.js";
import ShoppingCartModel from '../models/ShoppingCart.js';

export default class Carts {
    constructor() {
        console.log("Estamos trabajando con la base de datos MongoDB para carritos");
    }

    async getAll() {
        try {
            const products = await productModel.find().lean();
            return products;
        } catch (error) {
            console.error("Error al obtener todos los productos:", error);
            throw error;
        }
    }

    async save(product) {
        try {
            const result = await productModel.create(product);
            return result;
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            throw error;
        }
    }
}
