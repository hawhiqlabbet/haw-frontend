var currCode = "";
var currHost = "";
const secretKey = "MySecretKey";
const clients = {};

const disconnectTimeout = 60000; // 60 seconds in milliseconds
let disconnectTimer;

function socketEvents(io) {
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
            if (name === currHost) {
                currHost = "";
                currCode = "";

                // Emit lobby shutting down
                io.emit("host_disconnected");
            }
            delete clients[socket.id];
        });
    });
}

module.exports = socketEvents;
