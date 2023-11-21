const activeLobbies = new Map();
const socketToNameAndLobby = new Map(); // Used to disconnect users who do not manually leave

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
    })
}

function handleJoinGame(io, socket) {
    socket.on('joinGame', (data) => {
        const { gameId, username, imageUrl } = data;

        // Add socket id name and game id to socketToNameAndLobby
        socketToNameAndLobby.set( socket.id, { username: username, gameId: gameId } )

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

        // Add socket id name and game id to socketToNameAndLobby
        socketToNameAndLobby.set( socket.id, { username: username, gameId: gameId } )

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

        // Get what the disconnecting socket was up to when disconnecting
        /*
        const whatsUp = socketToNameAndLobby.get(socket.id)
        if(!whatsUp)
            return

        // Get the game lobby and remove client from it
        const gameId    = whatsUp.gameId
        const username  = whatsUp.username
        if (gameId) {
            const lobby = activeLobbies.get(whatsUp.gameId)
            // If disconnecting client was host, send to other clients
            if(lobby && lobby.host === whatsUp.username) {
                io.to(gameId).emit('lobbyClosed', { gameId, username });
                io.in(gameId).socketsLeave(gameId);
                console.log(`Lobby ${gameId} closed by host disconnecting ${username}`);
                activeLobbies.delete(gameId);
                console.log(activeLobbies);
            }
            else if(lobby) {
                // If disconnecting client was a client, send to other clients
                console.log(`${username} left the game ${gameId}`);
                io.to(gameId).emit('playerLeft', { gameId, username });
                lobby.players = lobby.players.filter(player => player !== username);
                activeLobbies.set(gameId, lobby);
                console.log(activeLobbies);
            }
        }
        */
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

module.exports = {
    activeLobbies,
    socketToNameAndLobby,
    socketEvents
}