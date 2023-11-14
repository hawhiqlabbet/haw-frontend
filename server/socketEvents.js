const activeLobbies = new Map();

function socketEvents(io) {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        console.log(io.engine.clientsCount);

        // Handle game-related events and synchronization here...
        handleJoinGame(socket);
        handleHostGame(socket);
        handleDisconnect(socket);
    })
}

function handleJoinGame(socket) {
    socket.on('joinGame', (data) => {
        const { gameId, username } = data;

        socket.join(gameId);

        io.to(gameId).emit('playerJoined', { username });

        console.log(`User ${username} joined game ${gameId}`);

    })
}

function handleHostGame(socket) {

    socket.on('hostGame', (data) => {
        const { gameId, username } = data;

        socket.join(gameId);
        console.log(`User ${username} hosted game ${gameId}`);
    })

}

function handleDisconnect(socket) {

    socket.on('disconnect', (data) => {
        
        const { gameId, username } = data;

        const lobby = activeLobbies.get(gameId);
        
        if (lobby && lobby.players.includes(username)) {
            lobby.players = lobby.players.filter(player => player !== username);
            io.to(gameId).emit('playerLeft', { username });
            console.log(`User ${username} left game ${gameId}`);
        }
    })

}

module.exports = {
    activeLobbies,
    socketEvents
}