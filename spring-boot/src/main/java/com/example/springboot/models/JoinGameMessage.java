package com.example.springboot.models;

import lombok.Data;

@Data
public class JoinGameMessage {
    private String gameId;
    private String username;
    private String imageUrl;

    // getters and setters
}