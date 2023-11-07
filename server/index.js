const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3001; // Choose a port number

var currCode = "";
const activeUsers = new Set();
const secretKey = "MySecretKey";

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


app.get('/join', (req, res) => {
  
});

app.get('/host', (req, res) => {
  //if(currCode != ""){
    // Generate a 4-letter code
    const code = crypto.randomBytes(2).toString('hex').toUpperCase();
    currCode = code;
    // Create a JWT token
    const token = jwt.sign({ code }, secretKey, { expiresIn: '1 hour' });
    // Send the JWT and code to the client
    res.json({ token, code });
//  }
/*  else{
    const code  = ""
    const token = ""
    res.json({ token, code})
  }
  */
  console.log(currCode);
});



io.on("connection", (socket) => {
  console.log(`User conntected, ${socket.id}`);
})

io.on("hello world", (socket) => {
  console.log("weee");
})

io.on("sent message", (socket) => {
  console.log("weee");
})