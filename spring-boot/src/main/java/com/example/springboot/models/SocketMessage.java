package com.example.springboot.models;

import lombok.Data;

import java.util.List;

@Data
public class SocketMessage {
    private String message;
    private String gameId;
    private String username;
    private List<Player> data;

    public SocketMessage() {
    }

    public SocketMessage(String message, List<Player> data, String gameId, String username) {
        this.message = message;
        this.data = data;
        this.gameId = gameId;
        this.username = username;
    }
}
