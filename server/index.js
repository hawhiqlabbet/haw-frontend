const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require('./routes/routes');
const socketEvents = require('./socketEvents');

app.use('', routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

const port = "3001";

server.listen(3001, () => {
  console.log(`SERVER IS RUNNING ON PORT ${port}`);
})

socketEvents(io);







