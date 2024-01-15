import fs from 'fs';
import { join } from 'path';
import __dirname from '../../utils.js';

const filePath = join(__dirname, '/files/users.json');

export default class UserDAO {
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

    async save(user) {
        try {
            user.cart = [];
            let users = await this.getAll();

            const newUser = {
                id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
                ...user,
            };

            users.push(newUser);

            await fs.promises.writeFile(filePath, JSON.stringify(users, null, '\t'));
            return newUser;
        } catch (error) {
            console.error("No se pudo guardar el archivo:", error);
            throw error;
        }
    }
}
