const express = require('express');
const app = express();

const proxy = require('express-http-proxy');

const PORT = process.env.PORT || 8000;

const errorHandler = (err, res, next) => {
    console.log(err);
    res.status(500).send('Error connecting to gateway');
};

app.use('/product-service', proxy('http://product-service:8001', {
    proxyErrorHandler: errorHandler
}));

app.use('/user-service', proxy('http://user-service:8002', {
    proxyErrorHandler: errorHandler
}));

app.use('/', (req, res) => {
    res.send('Hello from the api gateway');
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
}).on('error', (err) => {
    console.log('API Gateway error', err);
});