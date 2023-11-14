require('./loadEnvironment'); // Import environment variables
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketIo = require('socket.io');
const cors = require('cors');
const routes = require('./routes/routes');
const { socketEvents } = require('./socketEvents');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
socketEvents(io);
const PORT = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', routes);

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});








