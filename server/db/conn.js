const { MongoClient } = require('mongodb');
const connectionString = process.env.ATLAS_URI || "";

async function connectToCluster() {
    let mongoClient;

    try {
        mongoClient = new MongoClient(connectionString);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');

        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
}

module.exports = { connectToCluster };
