const pool = require('../config'); // Pastikan file config.js sudah ada untuk koneksi database
const multer = require('multer');
const path = require('path');

// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik dengan timestamp
  },
});
const upload = multer({ storage });

// Create Product
const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const result = await pool.query(
      'INSERT INTO product (name, image, description, price, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, image, description, price, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM product');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : req.body.image; // Gunakan gambar lama jika tidak ada yang baru
  try {
    const result = await pool.query(
      'UPDATE product SET name = $1, image = $2, description = $3, price = $4, category = $5 WHERE id = $6 RETURNING *',
      [name, image, description, price, category, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct: [upload.single('image'), createProduct],
  getAllProducts,
  getProductById,
  updateProduct: [upload.single('image'), updateProduct],
  deleteProduct,
};