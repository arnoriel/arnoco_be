const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth');
const productController = require('./controllers/product');

const app = express();
const port = 5000;

const corsOptions = {
  origin: ['http://localhost:3000', 'https://hbl69h90-3000.asse.devtunnels.ms'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from backend!' });
  });
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

app.use('/uploads', express.static('uploads')); // Akses gambar dari folder uploads

// Product routes
app.post('/api/products', productController.createProduct);
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});