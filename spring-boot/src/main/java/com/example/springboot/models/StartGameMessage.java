package com.example.springboot.models;

import lombok.Data;

@Data
public class StartGameMessage {
    private String username;
    private String country;
    private String gameChoice;
    private String gameId;
    private long endTime;
    private long endVoteTime;

    public StartGameMessage(String username, String country, String gameChoice, long endTime, long endVoteTime) {
        this.username = username;
        this.country = country;
        this.gameChoice = gameChoice;
        this.endTime = endTime;
        this.endVoteTime = endVoteTime;
    }

    public StartGameMessage() {
        this.username = "";
        this.country = "";
        this.gameChoice = "";
        this.endTime = 0;
        this.endVoteTime = 0;
    }
}
