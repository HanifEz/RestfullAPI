const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const secretKey = 'secretkey';

let users = [];
// Middleware untuk parsing body dari request
app.use(express.json());

// Middleware untuk authentication
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// API Register
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: users.length + 1,
            username: req.body.username,
            password: hashedPassword
        });
        res.status(201).send('User berhasil terdaftar.');
    } catch {
        res.status(500).send('Gagal mendaftar user.');
    }
});

// API Login
app.post('/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (user == null) {
        return res.status(400).send('User tidak ditemukan.');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Buat token JWT
            const accessToken = jwt.sign(user, secretKey);
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).send('Password salah.');
        }
    } catch {
        res.status(500).send('Gagal login.');
    }
});

// API yang memerlukan authentication
app.get('/protected', authenticateToken, (req, res) => {
    res.send('Endpoint ini hanya bisa diakses oleh user yang terotentikasi.');
});
