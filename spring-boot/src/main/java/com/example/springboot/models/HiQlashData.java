package com.example.springboot.models;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.*;

import static java.lang.Math.max;
import static java.lang.Math.min;

@Data
public class HiQlashData implements LobbyData{
    boolean answeringPrompts;
    int currRound;
    int numPlayers;
    int numRounds;
    long endTime;
    long endVoteTime;
    long endVoteTimeConst;
    List<PlayerPrompts> promptsForPlayers;
    List<String> prompts = Arrays.asList(
            "Do you like Jazz1?", "Do you like Jazz2?", "Do you like Jazz3?", "Do you like Jazz4?", "Do you like Jazz5?",
            "Do you like Jazz6?", "Do you like Jazz7?", "Do you like Jazz8?", "Do you like Jazz9?", "Do you like Jazz10?"
    );
    List<PlayerScores> playerScores;
    List<String> usedPrompts;

    public HiQlashData(int numPlayers, List<Player> players, long endTime, long endVoteTime) {
        Collections.shuffle(this.prompts);
        Collections.shuffle(players);

        this.answeringPrompts = true;
        this.currRound        = 1;
        this.numPlayers       = numPlayers;
        this.numRounds        = numPlayers;
        this.endTime          = endTime;
        this.endVoteTime      = endVoteTime;
        this.endVoteTimeConst = endVoteTime;

        this.promptsForPlayers = new ArrayList<PlayerPrompts>();
        this.playerScores      = new ArrayList<PlayerScores>();
        this.usedPrompts       = new ArrayList<String>();

        for(int i = 0; i < numPlayers; ++i) {
            String playerName = players.get(i).getUsername();
            PlayerPrompts playerPrompts = new PlayerPrompts(playerName);

            // Initialize scores
            this.playerScores.add(new PlayerScores(playerName, 0));

            // Determine prompts for each player
            for(int j = 0; j < 2; ++j) {
                int promptIndex = i + j;
                if(i == (numPlayers - 1) && j == 1) {
                    promptIndex = 0;
                }
                playerPrompts.prompts.add(prompts.get(promptIndex));
                playerPrompts.promptAnswers.add("");
                usedPrompts.add(prompts.get(promptIndex));
            }

            // Add unique prompts to the player
            promptsForPlayers.add(playerPrompts);
        }
        Collections.shuffle(this.usedPrompts);
    }

    @Data
    public static class PlayerScores {
        String username;
        int score;

        public PlayerScores (String username, int score){
            this.username = username;
            this.score    = score;
        }
    }
    @Data
    public static class PlayerPrompts {
        List<String> promptAnswers;
        List<String> prompts;
        String player;

        public PlayerPrompts(String player){
            this.promptAnswers = new ArrayList<String>();
            this.prompts       = new ArrayList<String>();
            this.player        = player;
        }
    }

    @EqualsAndHashCode(callSuper = true)
    @Data
    public static class StartGameMessage extends com.example.springboot.models.StartGameMessage {
        private List<String> prompts;

        public StartGameMessage(String username, String gameId, long endTime, long endVoteTime, List<String> prompts) {
            super(username, gameId, endTime, endVoteTime);
            this.prompts = prompts;
        }

        public StartGameMessage() {
            super();
            this.prompts = new ArrayList<String>();
        }
    }

    public List<String> getPlayerPrompts(String username){
        for(PlayerPrompts p: promptsForPlayers) {
            if(username.equals(p.player)){
                return p.prompts;
            }
        }
        System.err.println("Player " + username + " does not have any prompts");
        return new ArrayList<String>();
    }

    public List<String> getPlayersHavingPrompt(String inputPrompt){
        List<String> players = new ArrayList<String>();
        for(PlayerPrompts playerPrompts: promptsForPlayers) {
            for(String prompt : playerPrompts.getPrompts())
                if(prompt.equals(inputPrompt)){
                    players.add(playerPrompts.getPlayer());
                    if(players.size() == 2)
                        return players;
            }
        }
        System.err.println("Number of players having prompt " + inputPrompt + " is not 2");
        return players;
    }

    public void setAnswer(String player, String prompt, String answer) {
        for(PlayerPrompts p : promptsForPlayers) {
            if(p.getPlayer().equals(player)) {
                p.promptAnswers.set(p.getPrompts().indexOf(prompt), answer);
            }
        }
    }
}
