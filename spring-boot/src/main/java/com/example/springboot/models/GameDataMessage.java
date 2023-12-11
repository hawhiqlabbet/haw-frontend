package com.example.springboot.models;

import lombok.Data;

import java.util.List;

@Data
public class GameDataMessage {
    private String country;
    private long endTime;
    private long endVoteTime;
    private boolean foundSpy;
    private String spyName;
    List<SpyQData.VotingObject> votingObject;

    public GameDataMessage(String country, long endTime, long endVoteTime, boolean foundSpy, String spyName, List<SpyQData.VotingObject> votingObject){
        this.country = country;
        this.endTime = endTime;
        this.endVoteTime = endVoteTime;
        this.foundSpy = foundSpy;
        this.spyName = spyName;
        this.votingObject = votingObject;
    }
}
