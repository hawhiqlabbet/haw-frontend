const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const http = require('http');
const { Server } = require('socket.io');
const { hostname } = require('os');

var bodyParser = require("body-parser");

const app = express();
const port = 3001; // Choose a port number

var currCode = "";
var currHost = "";
const secretKey = "MySecretKey";
const clients = {};

app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
})

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/join', (req, res, next) => {
  console.log("Current code: " + currCode);
  console.log("Current host: " + currHost);
  console.log(req.body.code);
  if(currCode === req.body.code) {
    res.json({"success": "true"});
  }
  else{
    res.json({"success": "false"});
  }
});

app.get('/host', (req, res) => {
  console.log("Someone is trying to host");
  if(currCode == "") {
    const code = crypto.randomBytes(2).toString('hex').toUpperCase();
    currCode = code;
    // Create a JWT token
    const token = jwt.sign({ code }, secretKey, { expiresIn: '1 hour' });
    // Send the JWT and code to the client
    res.json({ token, code });
    console.log(currCode);
  }
  else{
    res.json({"token": "", "code": ""});
  }
});


const disconnectTimeout = 60000; // 60 seconds in milliseconds
let disconnectTimer;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  console.log(io.engine.clientsCount);

  socket.on("setHostUsername", (username) => {
    console.log(`Setting host username to:${username}`)
    clients[socket.id] = username;
    currHost = username;
  });

  socket.on("setClientUsername", (username) => {
    console.log(`Setting client username to:${username}`)
    clients[socket.id] = username;
  });

  /*
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected, reason: ${reason}`);
    console.log(currHost);
    if(clients[socket.id] === currHost){
      currHost = "";
      currCode = "";
    }
    delete clients[socket.id];
  });
  */

  socket.on("disconnectName", (name) => {
    console.log(`User disconnected, name: ${name}`)
    console.log(currHost);
    if(name === currHost){
      currHost = "";
      currCode = "";
      
      // Emit lobby shutting down
      io.emit("host_disconnected");
    }
    delete clients[socket.id];
  });
  

});

