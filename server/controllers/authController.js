/*
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookie = require('cookie');

const secretKey = "MySecretKey";
const usernames = [];

function generateTokenAndSetCookie(res, username) {
    const code = crypto.randomBytes(2).toString('hex').toUpperCase();
    const token = jwt.sign({ code, username }, secretKey, { expiresIn: '1 day' });

    res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: true
    }));

    return token;
}

function login(req, res) {

    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is missing in the query parameters' });
    }

    if (!usernames.includes(username)) {
        usernames.push(username);
        const token = generateTokenAndSetCookie(res, username);
        res
            .status(200)
            .json({ message: 'Successfully added username', token });
    } else {
        res
            .status(300)
            .json({ message: 'Username already taken' });
    }
}

function extractUsernameFromToken(req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.jwt;


    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);

            return res
                .status(200)
                .json({ message: 'Successfull retrival of username', username: decoded.username });
        } catch (error) {
            return res.status(300)
                .json({ message: 'JWT verification error:', error });
        }
    }

    return res.status(300)
        .json({ message: 'Not authenticated' });
}


module.exports = {
    login,
    extractUsernameFromToken
};
*/

const { connectToCluster } = require('../db/conn');
const jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
const { activeLobbies } = require('../socketEvents');
const { extractUsernameFromJwt } = require('../utils/jwtUtils');

async function register(req, res) {

    const { username, password } = req.body;
    let mongoClient;

    try {
        mongoClient = await connectToCluster();
        const db = mongoClient.db();
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Choose a different username.' });
        }

        const newUser = {
            username: username,
            password: bcrypt.hashSync(password, 8),
        }

        const result = await usersCollection.insertOne(newUser);
        console.log(`User registered with ID: ${result.insertedId}`);
        res.status(200).json({ message: 'User registered succesfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await mongoClient.close();
        console.log('MongoDB connection closed.');
    }
}

async function login(req, res) {

    const { username, password } = req.body;
    let mongoClient;

    try {
        mongoClient = await connectToCluster();
        const db = mongoClient.db();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true });

        res.status(200).json({ message: 'Login successful', username: user.username });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await mongoClient.close();
        console.log('MongoDB connection closed.');
    }
}

module.exports = {
    register,
    login
}