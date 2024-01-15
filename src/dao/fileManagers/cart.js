import fs from 'fs';
import { join } from 'path';
import __dirname from '../../utils.js';

const filePath = join(__dirname, '/files/products.json');

export default class ProductDAO {
    constructor() {
        console.log(`Trabajando en el archivo ${filePath}`);
    }

    async getAll() {
        try {
            if (fs.existsSync(filePath)) {
                const data = await fs.promises.readFile(filePath, 'utf8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            console.error("No se pudo leer el archivo:", error);
            throw error;
        }
    }

    async save(product) {
        try {
            let products = await this.getAll();

            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                ...product,
            };

            products.push(newProduct);

            await fs.promises.writeFile(filePath, JSON.stringify(products, null, '\t'));
            return newProduct;
        } catch (error) {
            console.error("No se pudo guardar el archivo:", error);
            throw error;
        }
    }

    async delete(productId) {
        try {
            let products = await this.getAll();
            const updatedProducts = products.filter(product => product.id !== productId);

            await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts, null, '\t'));
            return { success: true, message: 'Product deleted successfully' };
        } catch (error) {
            console.error("No se pudo eliminar el producto:", error);
            throw error;
        }
    }

    async update(productId, updatedData) {
        try {
            let products = await this.getAll();
            const index = products.findIndex(product => product.id === productId);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedData };
                await fs.promises.writeFile(filePath, JSON.stringify(products, null, '\t'));
                return { success: true, message: 'Product updated successfully' };
            } else {
                return { success: false, message: 'Product not found' };
            }
        } catch (error) {
            console.error("No se pudo actualizar el producto:", error);
            throw error;
        }
    }
}
