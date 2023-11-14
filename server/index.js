require('./loadEnvironment'); // Import environment variables
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const routes = require('./routes/routes');
const socketEvents = require('./socketEvents');
const { connectToDatabase } = require('./db/conn');

const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, {
});


server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

socketEvents(io);







