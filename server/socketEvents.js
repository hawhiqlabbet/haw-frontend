const activeLobbies = new Map();

function socketEvents(io) {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle game-related events and synchronization here...
        handleJoinGame(io, socket);
        handleHostGame(io, socket);
        handleCloseLobby(io, socket);
        handleLeaveGame(io, socket);
        handleDisconnect(io, socket);
    })
}

function handleJoinGame(io, socket) {
    socket.on('joinGame', (data) => {
        const { gameId, username } = data;

        socket.join(gameId);

        io.to(gameId).emit('playerJoined', { username });

        console.log(`User ${username} joined game ${gameId}`);

    })
}

function handleHostGame(io, socket) {

    socket.on('hostGame', (data) => {
        const { gameId, username } = data;

        socket.join(gameId);
        console.log(`User ${username} hosted game ${gameId}`);
    })

}

function handleCloseLobby(io, socket) {

    socket.on('closeLobby', (data) => {
        const { gameId, username } = data
        io.to(gameId).emit('lobbyClosed', { gameId, username });
        io.in(gameId).socketsLeave(gameId);
        console.log(`Lobby ${gameId} closed by host ${username}`);
    })

}

function handleLeaveGame(io, socket) {
    socket.on('leaveGame', (data) => {
        const { gameId, username } = data;
        console.log(`${username} left the game ${gameId}`);
        io.to(gameId).emit('playerLeft', { gameId, username });
    })
}

function handleDisconnect(io, socket) {

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    })
}




module.exports = {
    activeLobbies,
    socketEvents
}