const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Simple hardcoded admin credentials (replace with DB in production)
const ADMIN = { username: 'korben', password: '1313' };

app.use(bodyParser.json());
app.use(session({
    secret: 'roblox-shop-secret',
    resave: false,
    saveUninitialized: true,
}));

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN.username && password === ADMIN.password) {
        req.session.isAdmin = true;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Admin logout endpoint
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// Example protected admin route
app.get('/api/admin/dashboard', (req, res) => {
    if (req.session.isAdmin) {
        res.json({ message: 'Welcome to the admin dashboard!' });
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
});

// Serve static files (your index.html, etc.)
app.use(express.static(__dirname));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});