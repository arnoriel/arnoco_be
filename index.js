const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from backend!' });
  });
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});