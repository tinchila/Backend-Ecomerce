
const generateMockProducts = () => {
    const mockProducts = [];
    for (let i = 1; i <= 100; i++) {
        const product = {
            _id: `mock_product_${i}`,
            title: `Mock Product ${i}`,
            description: `Description for Mock Product ${i}`,
            price: Math.random() * 100,
            stock: Math.floor(Math.random() * 50) + 1,
        };
        mockProducts.push(product);
    }
    return mockProducts;
};

export default generateMockProducts;
