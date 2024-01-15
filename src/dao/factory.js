
import Users from './dbManagers/user.js';
import Carts from './dbManagers/cart.js';

export default class Factory {
    constructor(managerType) {
        switch (managerType) {
            case 'mongo':
                this.userManager = new Users();
                this.cartManager = new Carts();
                break;
            default:
                throw new Error('Invalid manager type');
        }
    }

    getUserManager() {
        return this.userManager;
    }

    getCartManager() {
        return this.cartManager;
    }
}
