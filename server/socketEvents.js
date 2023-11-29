const activeLobbies = new Map();
const lobbyData     = new Map();
const socketToUser  = new Map();
const lastUpdateTimestamps = new Map();

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
        handleVotingDone(io, socket);

        // Timer update logic, for example, triggered by a setInterval
        setInterval(() => {
        // Update the timer value (replace this with your actual timer logic)
            for (const gameId of activeLobbies.keys()) {
                const currentTime = new Date().getTime();

                if (!lastUpdateTimestamps.has(gameId) || currentTime - lastUpdateTimestamps.get(gameId) >= 1000) {
                    if(lobbyData.get(gameId)) {
                        lobbyData.get(gameId).gameData.endTime     -= 1
                        lobbyData.get(gameId).gameData.endVoteTime -= 1

                        // Update the last update timestamp for this gameId
                        lastUpdateTimestamps.set(gameId, currentTime);

                        // Broadcast the updated timer value to all connected clients
                        const endTime       = lobbyData.get(gameId).gameData.endTime
                        const endVoteTime   = lobbyData.get(gameId).gameData.endVoteTime
                        io.to(gameId).emit('timeUpdateEvent', { endTime: endTime, endVoteTime: endVoteTime });
                    } 
                }
            }
        }, 1000); // Update every second (adjust this interval based on your needs)
    })
}

function handleJoinGame(io, socket) {
    socket.on('joinGame', (data) => {
        const { gameId, username, imageUrl } = data;
        socket.join(gameId);
        socketToUser.set(socket.id, username)
        const players = activeLobbies.get(gameId).players;
        io.to(gameId).emit('playerJoined', { username, imageUrl, players });
        io.to(socket.id).emit('userList', { users: players });

        console.log(`User ${username} joined game ${gameId} and image url ${imageUrl} and the players are ${players}`);

    })
}

function handleHostGame(io, socket) {

    socket.on('hostGame', (data) => {
        const { gameId, username, gameChoice } = data;
        socketToUser.set(socket.id, username)
        socket.join(gameId)
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
        const lobby         = activeLobbies.get(gameId);
        const gameChoice    = lobby.gameChoice

        if(lobby.gameChoice === 'SpyQ') {
            const country       = lobbyData.get(gameId).gameData.country
            const endTime       = lobbyData.get(gameId).gameData.endTime
            const endVoteTime   = lobbyData.get(gameId).gameData.endVoteTime

            // Conditional emit depending on if spy
            const room = io.sockets.adapter.rooms.get(gameId);
            if (room) {
                const spy = lobbyData.get(gameId).gameData.spyName
                for (const id of room) {
                    const socket = io.sockets.sockets.get(id);
                    
                    if (socketToUser.get(id) !== spy) {
                        const gameData = {country, endTime, endVoteTime}
                        socket.emit('hostStarted', { username, gameChoice, gameData });
                    } else {
                        const gameData = {endTime, endVoteTime}
                        socket.emit('hostStarted', { username, gameChoice, gameData });
                    }
                }
            } else {
                console.log(`Room ${gameId} does not exist or has no sockets.`);
            }
        }
        
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
        // socketToUser.set(socket.id, username)
        console.log("Reconnecting")
        const { gameId } = data;
        socket.join(gameId)
    })
}

function handleVotingDone(io, socket) {
    socket.on('reportVotingDone', (data) => {
        const { gameId } = data;
        const votingData = lobbyData.get(gameId).gameData.votingObject
        const foundSpy   = lobbyData.get(gameId).gameData.foundSpy
        console.log(`Voting done for lobby ${gameId}`)
        io.to(gameId).emit('votingDone', { gameId: gameId, votingData: votingData, foundSpy: foundSpy });
    })
}

module.exports = {
    activeLobbies,
    lobbyData,
    socketEvents
}