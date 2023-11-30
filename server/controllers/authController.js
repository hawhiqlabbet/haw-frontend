const { connectToCluster } = require('../db/conn');
const jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
const { activeLobbies } = require('../socketEvents');
const { extractUsernameFromJwt } = require('../utils/jwtUtils');
const { generateRandomAvatarString } = require('../utils/authUtils');

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
            imageUrl: `https://api.multiavatar.com/${generateRandomAvatarString()}.png`,
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

        res.cookie('jwt', token, { sameSite: 'Lax', httpOnly: true });

        res.status(200).json({ message: 'Login successful', username: user.username, imageUrl: user.imageUrl });
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