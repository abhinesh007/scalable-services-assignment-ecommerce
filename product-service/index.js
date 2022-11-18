const express = require('express');
const app = express();

const PORT = process.env.PORT || 8001;
const products = require('./products-mock-data.json') || [];

app.get('/categories', (req, res) => {
    const categoriesAll = products.map(i => i.category) || [];
    const categoriesUnique = [...new Set(categoriesAll)];
    console.log('categoriesUnique', categoriesUnique)

    res.status(200).json(categoriesUnique);
});

app.get('/products', (req, res) => {
    res.status(200).json(products || []);
});

app.get('/product/:productId', (req, res) => {
    console.log(req.params)

    if(!req.params.productId) {
        res.status(400).send('Error: Please add a productId to fetch details');
    }

    const product = products.find(p => p.id == req.params.productId);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(401).send(`Error: No product found with id - ${req.params.productId}`);
    }
});

app.get('/products/category/:category', (req, res) => {

    if(!req.params.category) {
        res.status(400).send('Error: Please add a category to fetch products');
    }

    const categoryWiseProducts = products.filter(p => p.category == req.params.category);

    if (categoryWiseProducts) {
        res.status(200).json(categoryWiseProducts);
    } else {
        res.status(404).send(`Error: No product found for category - ${req.params.category}`);
    }
});

app.use('/', (req, res) => {
    res.send('Hello from the product service');
});

app.listen(PORT, () => {
    console.log(`Product service listening on port http://localhost:${PORT}`);
});