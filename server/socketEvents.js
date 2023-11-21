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
        handleHostStartGame(io, socket);
        handleDisconnectUsername(io, socket);
        handleReconnect(io, socket);
    })
}

function handleJoinGame(io, socket) {
    socket.on('joinGame', (data) => {
        const { gameId, username, imageUrl } = data;
        socket.join(gameId);
        const players = activeLobbies.get(gameId).players;
        io.to(gameId).emit('playerJoined', { username, imageUrl, players });
        io.to(socket.id).emit('userList', { users: players });

        console.log(`User ${username} joined game ${gameId} and image url ${imageUrl} and the players are ${players}`);

    })
}

function handleHostGame(io, socket) {

    socket.on('hostGame', (data) => {
        const { gameId, username, gameChoice } = data;
        socket.join(gameId)
        const lobby = activeLobbies.get(gameId);
        lobby.gameChoice = gameChoice
        console.log(`User ${username} hosted game ${gameId} with the choice ${gameChoice}`);
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

function handleHostStartGame(io, socket) {
    socket.on('startGame', (data) => {
        const { gameId, username } = data;
        const lobby = activeLobbies.get(gameId);
        const gameChoice = lobby.gameChoice
        io.to(gameId).emit('hostStarted', { username, gameChoice });
        console.log(`Host ${username} started game ${gameId} with mode ${gameChoice}`);
    })
}

function handleDisconnectUsername(io, socket) {
    socket.on('disconnectWithUsername', (data) => {
        const { username } = data;
        console.log(`User ${username} disconnected`)
    })
}

function handleReconnect(io, socket) {
    socket.on('reconnect', (data) => {
        console.log("Reconnecting")
        const { gameId } = data;
        socket.join(gameId)
    })
}

module.exports = {
    activeLobbies,
    socketEvents
}