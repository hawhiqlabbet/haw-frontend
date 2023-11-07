const express = require('express');
const cors = require('cors');
const http = require('http');
const socket = require('socket.io');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const port = 3001; // Choose a port number

var currCode = "";

const secretKey = "MySecretKey";

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = socket(server)

// Set up a connection event handler and other WebSocket event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (message) => {
    io.emit('chat message', message); // Broadcast the message to all connected clients
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(cors()); // Enable CORS for all routes

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



