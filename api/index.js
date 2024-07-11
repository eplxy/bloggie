const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const buildPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../client/build') // Production build path
    : path.join(__dirname, '../client/src'); // Development build path

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;
const bucket = 'stella-bloggie';
const PORT = process.env.PORT || 4000;

app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


function verifyJWT(token) {
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        else return info;
    })
    return null;
}


async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });

    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;

    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`
}


async function DeleteFromS3(path) {
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });

    await client.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: path,
    }));
}


app.post('/api/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
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

app.post('/api/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        return res.status(400).json('User not found');
    }
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
        res.status(400).json('Invalid credentials');
    }
});

app.get('/api/profile', (req, res) => {

    const { token } = req.cookies;
    if (token) {
        info = verifyJWT(token);
        res.json(info);
    } else {
        res.json(null);
    }
});

app.post('/api/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

const photosMiddleware = multer({ dest: '/tmp' });

app.post('/api/post', photosMiddleware.single('file'), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    let url = null;
    if (req.file) {
        const { originalname, path, mimetype } = req.file;
        url = await uploadToS3(path, originalname, mimetype);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: url,
            author: info.id
        });
        res.json(postDoc);
    });
});

app.put('/api/post', photosMiddleware.single('file'), async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    let url = null;


    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('You are not the author of this post.');
        }
        if (req.file) {
            if (postDoc.cover) {
                const splits = postDoc?.cover.split('/');
                const coverFileName = splits[splits.length - 1];
                await DeleteFromS3(coverFileName);
            }
            const { originalname, path, mimetype } = req.file;
            url = await uploadToS3(path, originalname, mimetype);
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: url ? url : postDoc.cover
        });



        res.json(postDoc);
    });
});

app.get('/api/post', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    res.json(await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20));
});

app.get('/api/post/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.delete('/api/post/:id', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id } = req.params;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('You are not the author of this post.');
        }
        if (postDoc.cover) {
            const splits = postDoc?.cover.split('/');
            const coverFileName = splits[splits.length - 1];
            await DeleteFromS3(coverFileName);
        }
        await postDoc.deleteOne();
        res.status(204).json();
    });
});


app.use(express.static(buildPath));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});