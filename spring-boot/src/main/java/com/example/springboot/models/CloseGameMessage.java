package com.example.springboot.models;
import lombok.Data;

@Data
public class CloseGameMessage {
    private String gameId;
    private String username;

    public CloseGameMessage(String gameId, String username) {
        this.gameId = gameId;
        this.username = username;
    }
}