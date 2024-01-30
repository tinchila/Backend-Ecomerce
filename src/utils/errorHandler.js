import Logger from './logger.js';

export const errorDictionary = {
    INCOMPLETE_DATA: "Incomplete data. Please provide all required fields.",
    PRODUCT_NOT_FOUND: "Product not found.",
    CART_NOT_FOUND: "Cart not found.",
    INSUFFICIENT_STOCK: "Insufficient stock for the requested quantity.",
    INTERNAL_SERVER_ERROR: "Internal server error.",
};

export const errorHandler = (errorKey, res) => {
    const errorMessage = errorDictionary[errorKey] || errorDictionary.INTERNAL_SERVER_ERROR;
    res.status(400).json({ status: 'error', message: errorMessage });

    Logger.error(`Error occurred: ${errorMessage}`);
};
