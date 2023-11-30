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

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'http://4.225.37.225' : 'http://localhost:4200',
  credentials: true,
}

const io = new Server(server, { cors: corsOptions });
socketEvents(io);
const PORT = 3000;

app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', routes);

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});








