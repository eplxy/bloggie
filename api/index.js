const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = '231pap423e24c6s6sor1s2r8ck';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://stevendvlam:83Hziq0PeQE5or1I@cluster0.8lqlbbo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }

});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('Invalid credentials')
    }
})

app.get('/profile', (req, res) => {
    res.json(req.cookies);
})

app.listen(4000);
