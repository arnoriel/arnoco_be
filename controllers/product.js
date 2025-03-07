const pool = require('../config');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Create Product
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, size } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const result = await pool.query(
      'INSERT INTO product (name, image, description, price, category, stock, size, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
      [name, image, description, price, category, stock, size]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Products with Search
const getAllProducts = async (req, res) => {
  const { search } = req.query;
  try {
    let query = 'SELECT * FROM product ORDER BY updated_at DESC';
    let values = [];
    
    if (search) {
      query = 'SELECT * FROM product WHERE name ILIKE $1 ORDER BY updated_at DESC';
      values = [`%${search}%`];
    }
    
    const result = await pool.query(query, values);
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
  const { name, description, price, category, stock, size } = req.body;
  const image = req.file ? req.file.filename : req.body.image;
  try {
    const result = await pool.query(
      'UPDATE product SET name = $1, image = $2, description = $3, price = $4, category = $5, stock = $6, size = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [name, image, description, price, category, stock, size, id]
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