package com.example.springboot.models;

// GameLobby.java
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
@Data
public class GameLobby {
    private String host;
    private int timeout;
    private String gameChoice;
    private List<String> players;


    public GameLobby(String host, int timeout, String gameChoice) {
        this.host = host;
        this.timeout = timeout;
        this.gameChoice = gameChoice;
        this.players = new ArrayList<String>();
    }

    public String getHost() {
        return host;
    }

    public String getGameChoice(){
        return this.gameChoice;
    }

    public void addPlayer(String player) {
        players.add(player);
    }

    public void removePlayer(String player) {
        players.remove(player);
    }

    public List<String> getPlayers() {
        return this.players;
    }

    // Other getters and methods as needed
}
