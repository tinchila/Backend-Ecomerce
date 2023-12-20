import fs from 'fs';
import __dirname from '../../utils.js';

const path = __dirname + '/files/products.json';

export default class Products {
    constructor() {
        console.log(`Trabajando en el archivo ${path}`);
    }

    getAll = async () => {
        if (fs.existsSync(path)) {
            try {
                let data = await fs.promises.readFile(path, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                console.log("No se pudo leer el archivo: " + error);
                return null;
            }
        } else {
            return [];
        }
    }

    saveProduct = async (product) => {
        try {
            let products = await this.getAll();
            if (products.length === 0) {
                product.id = 1;
                products.push(product);
                await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
            } else {
                product.id = products[products.length - 1].id + 1;
                products.push(product);
                await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
            }
            return product;
        } catch (error) {
            console.log("No se pudo guardar el archivo: " + error);
            return null;
        }
    }
    deleteProduct = async (productId) => {
        try {
            let products = await this.getAll();
            const updatedProducts = products.filter(product => product.id !== productId);

            await fs.promises.writeFile(path, JSON.stringify(updatedProducts, null, '\t'));
            return { success: true, message: 'Product deleted successfully' };
        } catch (error) {
            console.log("No se pudo eliminar el producto: " + error);
            return { success: false, message: 'Failed to delete product' };
        }
    }

    updateProduct = async (productId, updatedData) => {
        try {
            let products = await this.getAll();
            const index = products.findIndex(product => product.id === productId);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedData };
                await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
                return { success: true, message: 'Product updated successfully' };
            } else {
                return { success: false, message: 'Product not found' };
            }
        } catch (error) {
            console.log("No se pudo actualizar el producto: " + error);
            return { success: false, message: 'Failed to update product' };
        }
    }
}


