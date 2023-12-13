package com.example.springboot.models;
import lombok.Data;

@Data
public class NewRoundMessage {
    private String gameId;
    private String username;

    public NewRoundMessage(String gameId, String username) {
        this.gameId = gameId;
        this.username = username;
    }

    public NewRoundMessage(){
        this.gameId = "";
        this.username = "";
    }
}