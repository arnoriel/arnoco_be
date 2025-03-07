require('dotenv').config(); // Tambahkan ini di paling atas
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth');
const productController = require('./controllers/product');

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL.split(','), // Ambil dari .env dan ubah jadi array
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

app.use('/uploads', express.static(process.env.UPLOADS_DIR || 'uploads')); // Gunakan variabel dari .env

// Product routes
app.post('/api/products', productController.createProduct);
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.put('/api/products/:id', productController.updateProduct);
app.delete('/api/products/:id', productController.deleteProduct);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});