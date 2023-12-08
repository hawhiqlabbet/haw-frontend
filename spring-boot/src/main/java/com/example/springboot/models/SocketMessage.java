package com.example.springboot.models;

import lombok.Data;

@Data
public class SocketMessage {
    private String message;
    private String gameId;
    private String username;
    private Object data;

    public SocketMessage() {
    }

    public SocketMessage(String message, Object data, String gameId, String username) {
        this.message = message;
        this.data = data;
        this.gameId = gameId;
        this.username = username;
    }
}
