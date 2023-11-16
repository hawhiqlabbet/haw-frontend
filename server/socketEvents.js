const activeLobbies = new Map();

function socketEvents(io) {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle game-related events and synchronization here...
        handleJoinGame(io, socket);
        handleHostGame(socket);
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

function handleHostGame(socket) {

    socket.on('hostGame', (data) => {
        const { gameId, username, gameChoice } = data;

        socket.join(gameId);
        console.log(`User ${username} hosted game ${gameId} with the choice ${gameChoice}`);
    })

    socket.on('closeLobby', (data) => {
        const { gameId } = data;

        io.to(gameId).emit('lobbyClosed', { gameId });

        io.in(gameId).socketsLeave(gameId);
    })

}

function handleDisconnect(io, socket) {

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