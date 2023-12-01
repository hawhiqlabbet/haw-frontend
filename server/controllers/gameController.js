const { generateGameId } = require('../utils/gameUtils');
const { activeLobbies, lobbyData } = require('../socketEvents');
const { extractUsernameFromJwt } = require('../utils/jwtUtils');
const https = require('https')

function hostGame(req, res) {

    /*
    const token = req.cookies.jwt;
    const username = extractUsernameFromJwt(token);

    
    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }
    */
   const username = req.body.username;

   /*
    for (const lobby of activeLobbies.values()) {
        if (lobby.host === username) {
            return res.status(400).json({ message: 'User is already hosting a lobby' });
        }
    }
    */

    const gameId = generateGameId();
    const gameChoice = req.body.gameChoice;

    // 30 min timeout for lobby
    const currentTime = new Date()
    let timeout = new Date(currentTime.getTime() + 60000 * 30);     
    const timeLeftInSeconds = Math.floor((timeout.getTime() - currentTime.getTime()) / 1000);

    activeLobbies.set(gameId, { host: username, timeout: timeLeftInSeconds, gameChoice: gameChoice, players: [username] });
    console.log(`User ${username} hosted game ${gameId} with the choice ${gameChoice}`);
    console.log(activeLobbies);
    res.status(200).json({ gameId: gameId, username: username, message: 'hostGameSuccess' });
}

function joinGame(req, res) {

    /*
    const token = req.cookies.jwt;
    const username = extractUsernameFromJwt(token);

    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }
    */

    const username = req.body.username
    const gameId = req.body.gameId;

    if (!gameId) {
        return res.status(400).json({ message: 'Game ID is required to join a game' });
    }

    const lobby = activeLobbies.get(gameId);

    if (!lobby) {
        return res.status(404).json({ message: `Game with ID: ${gameId} not found` });
    }

    const isUserInGame = lobby.players.includes(username) || lobby.host === username;

    if (!isUserInGame) {
        //return res.status(400).json({ message: 'User is already in the game' });
        lobby.players.push(username);
        activeLobbies.set(gameId, lobby);
    }

    res.status(200).json({ gameId: gameId, username: username, message: 'joinGameSuccess' });
}


function closeLobby(req, res) {

    /*
    const token = req.cookies.jwt;
    const username = extractUsernameFromJwt(token);

    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }
    */

    const username = req.body.username;
    const gameId = req.body.gameId;

    if (!activeLobbies.has(gameId)) {
        return res.status(404).json({ message: `Game with ID: ${gameId} not found` });
    }

    const lobby = activeLobbies.get(gameId);

    if (lobby.host !== username) {
        return res.status(403).json({ message: 'You are not the host of this lobby' });
    }

    activeLobbies.delete(gameId);
    lobbyData.delete(gameId)
    console.log(activeLobbies);

    res.status(200).json({ message: 'closeLobbySuccess' });
}

function leaveGame(req, res) {

    /*
    const token = req.cookies.jwt;
    const username = extractUsernameFromJwt(token);

    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }
    */

    const username = req.body.username;
    const gameId = req.body.gameId;

    if (!activeLobbies.has(gameId)) {
        return res.status(404).json({ message: `Game with ID: ${gameId} not found` });
    }

    const lobby = activeLobbies.get(gameId);

    if (lobby.host === username) {
        return res.status(400).json({ message: 'Host cannot leave the game using this endpoint' });
    }

    if (!lobby.players.includes(username)) {
        return res.status(400).json({ message: 'User is not in the game' });
    }

    lobby.players = lobby.players.filter(player => player !== username);
    activeLobbies.set(gameId, lobby);
    console.log(activeLobbies);

    res.status(200).json({ message: 'leaveGameSuccess' });
}

function startGame(req, res) {

    /*
    const token = req.cookies.jwt;
    const username = extractUsernameFromJwt(token);
    

    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }
    */

    const gameId = req.query.gameId
    const username = req.body.username

    if (!activeLobbies.has(gameId)) {
        return res.status(404).json({ message: `Game with ID: ${gameId} not found` });
    }

    const lobby = activeLobbies.get(gameId);
    
    if (lobby.host !== username) {
        console.log("USERNAME TRYING TO HOST: ", username)
        return res.status(400).json({ message: 'Non host player cannot start the game' });
    }

    if (!lobby.players.includes(username)) {
        return res.status(400).json({ message: 'User is not in the game' });
    }

    // Do stuff
    console.log(activeLobbies);

    var country = ''
    if(lobby.gameChoice === 'SpyQ') {
        const gameTimeInS = req.body.gameTimeInS;

        const options = {
            hostname: 'restcountries.com',
            path: '/v3.1/region/europe',
            method: 'GET',
          };
        
          const request = https.request(options, (response) => {
            let data = '';
        
            // A chunk of data has been received.
            response.on('data', (chunk) => {
                    data += chunk;
            });
        
            // The whole response has been received.
            response.on('end', () => {
            try {
                // Parse the data into a JavaScript object
                const jsonData = JSON.parse(data)
                const randomIndex = Math.floor(Math.random() * jsonData.length);
                countryField = jsonData[randomIndex].name
                country = countryField.common

                // Spy game logic
                const spyIndex      = Math.floor(Math.random() * lobby.players.length);
                const spyName       = lobby.players[spyIndex]
                const votingObject  = lobby.players.map((player) => ({ player: player, votes: 0 }))
                const hasVoted      = lobby.players.map((player) => ({ player: player, hasVoted: false }))
                const foundSpy      = false

                const options = { timeZone: 'Europe/Stockholm' };
                const currentTime = new Date();
                let endTime;
                let endVoteTime;

                // 2 min default
                if (gameTimeInS) {
                    console.log("wee")
                    endTime = process.env.NODE_ENV === 'production' ? new Date(currentTime.getTime() + gameTimeInS * 1000) :  new Date(currentTime.getTime() + gameTimeInS * 1000);
                } else {
                    endTime = process.env.NODE_ENV === 'production' ? new Date(currentTime.getTime() + 60000 * 2) :  new Date(currentTime.getTime() + 20000);
                }

                // Calculate time left in seconds for endTime
                const timeLeftInSeconds = Math.floor((endTime.getTime() - currentTime.getTime()) / 1000);

                // Calculate time left in seconds for endVoteTime
                // Default 1 min vote time 
                const voteTimeLeftInSeconds = process.env.NODE_ENV === 'production' ? Math.floor((endTime.getTime() - currentTime.getTime() + 60000) / 1000) : Math.floor((endTime.getTime() - currentTime.getTime() + 20000) / 1000); 

                // Set endVoteTime in seconds
                endVoteTime = voteTimeLeftInSeconds;
                // Set endTime in seconds
                endTime = timeLeftInSeconds;
                console.log(endTime, " ", endVoteTime)

                lobbyData.set(gameId, { players: lobby.players, gameData: { spyName, country, votingObject, hasVoted, endTime, endVoteTime, foundSpy } } );

                res.status(200).json({ message: 'startGameSuccess' });
                } catch (error) {
                    console.error('Error parsing JSON:', error.message);
                }
            });
          });
        
          // Handle errors
          request.on('error', (error) => {
            console.error('Error making request:', error.message);
            response.status(500).send('Internal Server Error');
          });
        
          // End the request
          request.end();
    }
}

function getGameData(req, res) {

    /*
    const token = req.cookies.jwt;
    const username = extractUsernameFromJwt(token);
    

    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }
    */

    const username = req.query.username
    const gameId = req.query.gameId

    if (!activeLobbies.has(gameId)) {
        return res.status(404).json({ message: `Game with ID: ${gameId} not found` });
    }

    const lobby      = activeLobbies.get(gameId);
    const gameChoice = lobby.gameChoice

    if (!lobby.players.includes(username)) {
        return res.status(400).json({ message: 'User is not in the game' });
    }

    if(gameChoice === 'SpyQ') {
        const currLobbyData = lobbyData.get(gameId)
        if(!currLobbyData){
            res.status(200).json({ message: 'getGameDataSuccess', data: lobby });
            return
        }

        const country       = currLobbyData.gameData.country
        const endTime       = currLobbyData.gameData.endTime
        const endVoteTime   = currLobbyData.gameData.endVoteTime
        const votingObject  = currLobbyData.gameData.votingObject
        const foundSpy      = currLobbyData.gameData.foundSpy
        const spy = currLobbyData.gameData.spyName
        
        const personalData = {endTime, endVoteTime}
        if(currLobbyData.gameData.hasVoted && everyoneHasVoted(currLobbyData.gameData.hasVoted)) {
            personalData.votingObject = votingObject.sort((a, b) => b.votes - a.votes);
            personalData.foundSpy     = foundSpy 
            personalData.spyName      = spy
        }

        if (username !== spy) {
            personalData.country = country
            res.status(200).json({ message: 'getGameDataSuccess', data: lobby, gameData:  { username, gameChoice, personalData }});
        } else {
            res.status(200).json({ message: 'getGameDataSuccess', data: lobby, gameData:  { username, gameChoice, personalData }});
        }
    }
    else {
        res.status(200).json({ message: 'getGameDataSuccess', data: lobby });
    }
}

// SPYQ

// Function to increment votes for a specific option
const incrementVotes = (list, optionName) => {
    return list.map(option => {
      if (option.player === optionName) {
        // Increment the votes for the specified option
        return { ...option, votes: option.votes + 1 };
      }
      // For other options, keep the object unchanged
      return option;
    });
  };

// Function to check if a player has voted
const hasPlayerVoted = (list, currPlayer) => {
    return list.some(player => player.player === currPlayer && player.hasVoted);
  };

// Function to set a player to hasVoted
const setVoted = (list, player) => {
    return list.map(option => {
      if (option.player === player) {
        return { ...option, hasVoted: true };
      }
      return option;
    });
  };

// Function to check if everyone has voted
const everyoneHasVoted = (list) => {
    return list.every(player => player.hasVoted);
  };

const getPlayerWithMostVotes = (list) => {
    if (list.length === 0) {
        return null; // or handle accordingly if the array is empty
    }

    let maxVotesPlayer = list[0];

    for (let i = 1; i < list.length; i++) {
        if (list[i].votes > maxVotesPlayer.votes) {
        maxVotesPlayer = list[i];
        }
    }

    return maxVotesPlayer.player;
}

function spyQVote(req, res) {

    //const token = req.cookies.jwt;
    //const username = extractUsernameFromJwt(token);
    const gameId = req.query.gameId

    const votedFor = req.body.votedFor;
    const username = req.body.username;

    /*
    if (!username) {
        return res.status(401).json({ message: 'Error verifying JWT' });
    }

    if (!activeLobbies.has(gameId)) {
        return res.status(404).json({ message: `Game with ID: ${gameId} not found` });
    }

    if (!lobby.players.includes(username)) {
        return res.status(400).json({ message: 'User is not in the game' });
    }
    */

    const lobby         = activeLobbies.get(gameId);
    const currLobbyData = lobbyData.get(gameId);

   // Checking if player has voted
    if(hasPlayerVoted(currLobbyData.gameData.hasVoted, username)) {
        res.status(404).json({ message: `Player ${username} has already voted` })
    }
    else {
    lobbyData.get(gameId).gameData.hasVoted = setVoted(currLobbyData.gameData.hasVoted, username)
    lobbyData.get(gameId).gameData.votingObject = incrementVotes(currLobbyData.gameData.votingObject, votedFor)

    if(everyoneHasVoted(currLobbyData.gameData.hasVoted)) { 
        const playerMostVotes = getPlayerWithMostVotes(currLobbyData.gameData.votingObject)
        if(playerMostVotes == currLobbyData.gameData.spyName)
            lobbyData.get(gameId).gameData.foundSpy = true

        res.status(200).json({ message: 'spyQVoteSuccessDone', data: lobby });
    }
    else
        res.status(200).json({ message: 'spyQVoteSuccess', data: lobby });
    }
}

module.exports = {
    hostGame,
    joinGame,
    closeLobby,
    leaveGame,
    startGame,
    getGameData,
    spyQVote
};
