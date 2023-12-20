import productModel from "../models/products.js";

export default class Products {
    constructor() {
        console.log("Estamos trabajando con la base de datos MongoDB para productos");
    }

    getAll = async () => {
        let products = await productModel.find().lean();
        return products;
    }

    saveProduct = async (product) => {
        let result = await productModel.create(product);
        return result;
    }
}
