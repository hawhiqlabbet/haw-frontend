package com.example.springboot.socketIO;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.example.springboot.models.*;
import com.example.springboot.services.LobbyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class SocketModule {

    private final SocketIOServer server;
    private final SocketService socketService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private LobbyService lobbyService;

    public SocketModule(SocketIOServer server, SocketService socketService) {
        this.server = server;
        this.socketService = socketService;
        server.addConnectListener(onConnected());
        server.addDisconnectListener(onDisconnected());
        server.addEventListener("send_message", SocketMessage.class, onChatReceived());
        server.addEventListener("hostGame", SocketMessage.class, handleHostGame());
        server.addEventListener("closeLobby", CloseGameMessage.class, handleCloseLobby());
        server.addEventListener("leaveGame", SocketMessage.class, handleLeaveGame());
        server.addEventListener("startGame", StartGameMessage.class, handleStartGame());
        server.addEventListener("joinGame", JoinGameMessage.class, handleJoinGame());
        server.addEventListener("reportVotingDone", SocketMessage.class, handleVotingDone());


    }

    private DataListener<SocketMessage> handleVotingDone() {
        return (senderClient, data, ackSender) -> {

        };
    }

    private DataListener<StartGameMessage> handleStartGame() {
        return (senderClient, data, ackSender) -> {
            String gameId = data.getGameId();
            String username = data.getUsername();

            GameLobby lobby = lobbyService.getGameLobby(gameId);
            String gameChoice = lobby.getGameChoice();

            if(gameChoice.equals("SpyQ")) {
                SpyQData spyQData =(SpyQData) lobbyService.getLobbyData(gameId);
                String country      = spyQData.getCountry();
                long endTime        = spyQData.getEndTime();
                long endVoteTime    = spyQData.getEndVoteTime();

                // Dont send country to spy
                String spy = spyQData.getSpyName();

                if(spy.equals(username)) {
                    StartGameMessage testSpy = new StartGameMessage(username, "", gameChoice, endTime, endVoteTime);
                    lobbyService.socketToUser.get(spy).sendEvent("hostStarted", Map.of("username", username, "gameChoice", gameChoice, "gameData",testSpy));
                }
                else {
                    StartGameMessage test = new StartGameMessage(username, country, gameChoice, endTime, endVoteTime);
                    socketService.sendMessage(gameId, "hostStarted", lobbyService.socketToUser.get(spy), Map.of("username", username, "gameChoice", gameChoice, "gameData", test));
                }


            }
        };
    }

    private DataListener<SocketMessage> handleLeaveGame() {
        return (senderClient, data, ackSender) -> {
            String gameId = data.getGameId();
            String username = data.getUsername();

            // Socket to user
            lobbyService.socketToUser.remove(username);

            // Getting the list of players from the socketService
            List<String> players = lobbyService.activeLobbies.get(gameId).getPlayers();

            socketService.sendMessage(gameId, "playerLeft", senderClient,new SocketMessage(username, players, gameId, username));
        };
    }

    private DataListener<CloseGameMessage> handleCloseLobby() {
        return (senderClient, data, ackSender) -> {
            String gameId = data.getGameId();
            String username = data.getUsername();

            // Socket to user
            lobbyService.socketToUser.remove(username);

            // Getting the list of players from the socketService
            List<String> players = lobbyService.activeLobbies.get(gameId).getPlayers();

            socketService.sendMessage(gameId, "lobbyClosed", senderClient,new SocketMessage(username, players, gameId, username));
            socketService.closeLobby(gameId, senderClient);
        };
    }

    private DataListener<SocketMessage> handleHostGame() {
        return (senderClient, data, ackSender) -> {
            log.info(data.toString());

            String gameId = data.getGameId();
            String username = data.getUsername();

            // Joining the socket room
            senderClient.joinRoom(gameId);

            // Socket to user
            lobbyService.socketToUser.put(username, senderClient);

            senderClient.getNamespace().getBroadcastOperations().sendEvent("get_message", data.getMessage());
        };
    }

    private DataListener<JoinGameMessage> handleJoinGame() {
        return (senderClient, data, ackSender) -> {
            // Extracting data from SocketMessage
            String gameId = data.getGameId();
            String username = data.getUsername();
            String imageUrl = data.getImageUrl();

            // Joining the socket room
            senderClient.joinRoom(gameId);

            // Adding user to the socketToUser map
            senderClient.joinRoom(gameId);

            // Socket to user
            lobbyService.socketToUser.put(username, senderClient);

            // Getting the list of players from the socketService
            List<String> players = lobbyService.activeLobbies.get(gameId).getPlayers();

            // Emitting 'playerJoined' event to all clients in the room
            socketService.sendMessage(gameId, "playerJoined", senderClient, new SocketMessage(username, players, gameId, username));

            // Logging the event
            System.out.println("User " + username + " joined game " + gameId +
                    " and image url " + imageUrl + " and the players are " + players);
        };
    }

    private DataListener<SocketMessage> onChatReceived() {
        return (senderClient, data, ackSender) -> {
            log.info(data.toString());
            senderClient.getNamespace().getBroadcastOperations().sendEvent("get_message", data.getMessage());

        };
    }

    private ConnectListener onConnected() {
        return (client) -> {
            log.info("Socket ID[{}]  Connected to socket", client.getSessionId().toString());
        };

    }

    private DisconnectListener onDisconnected() {
        return client -> {
            log.info("Client[{}] - Disconnected from socket", client.getSessionId().toString());
        };
    }

}