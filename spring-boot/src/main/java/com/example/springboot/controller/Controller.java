package com.example.springboot.controller;

import com.example.springboot.models.*;
import com.example.springboot.services.LobbyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.InetAddress;
import java.util.*;

// Import the GameLobby class

import static com.example.springboot.services.LobbyService.generateGameId;

@RestController
@RequestMapping(path="/api/game")
public class Controller {
    @Autowired
    private LobbyService lobbyService;

    private final RestTemplate restTemplate;

    @Autowired
    public Controller(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }




    //@CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/host")
    public ResponseEntity<Map<String, Object>> hostGame(@RequestBody Map<String, String> request) {
        String username     = request.get("username");
        String gameChoice   = request.get("gameChoice");
        String imageUrl     = request.get("imageUrl");

        String gameId = generateGameId();

        // 30 min timeout for lobby
        Date currentTime = new Date();
        Date timeout = new Date(currentTime.getTime() + 60000 * 30);
        int timeLeftInSeconds = Math.toIntExact((timeout.getTime() - currentTime.getTime()) / 1000);

        // Create new GameLobby object
        GameLobby newLobby = new GameLobby(username, timeLeftInSeconds, gameChoice);
        newLobby.addPlayer(username, imageUrl);

        // Add GameLobby to list of game lobbies
        lobbyService.addLobby(gameId, newLobby);

        System.out.println("User " + username + " hosted game " + gameId + " with the choice " + gameChoice);

        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("gameId", gameId, "username", username, "message", "hostGameSuccess")
        );
    }

    //@CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> joinGame(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String gameId   = request.get("gameId");
        String imageUrl = request.get("imageUrl");


        if (gameId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Game ID is required to join a game"));
        }

        GameLobby lobby = lobbyService.getGameLobby(gameId);

        if (lobby == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        boolean isUserInGame = lobby.playerExists(username) || lobby.getHost().equals(username);

        if (!isUserInGame) {
            // Uncomment if you want to prevent users from joining the game multiple times
            // return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "User is already in the game"));

            lobby.addPlayer(username, imageUrl);
        }

        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("gameId", gameId, "username", username, "message", "joinGameSuccess")
        );
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping("/newRound")
    public ResponseEntity<Map<String, Object>> newRound(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String gameId = request.get("gameId");

        if (!lobbyService.lobbyExists(gameId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        GameLobby lobby  = lobbyService.getGameLobby(gameId);

        if (!lobby.getHost().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You are not the host of this lobby"));
        }

        lobbyService.removeLobbyData(gameId);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "newRoundSuccess"));
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @DeleteMapping("/close")
    public ResponseEntity<Map<String, Object>> closeLobby(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String gameId = request.get("gameId");

        if (!lobbyService.lobbyExists(gameId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        GameLobby lobby = lobbyService.getGameLobby(gameId);

        if (!lobby.getHost().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You are not the host of this lobby"));
        }

        lobbyService.removeLobby(gameId);
        // Assuming lobbyData is another data structure you're using
        lobbyService.removeLobbyData(gameId);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "closeLobbySuccess"));
    }

    //@CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/leave")
    public ResponseEntity<Map<String, Object>> leaveGame(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String gameId = request.get("gameId");

        if (!lobbyService.lobbyExists(gameId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        GameLobby lobby = lobbyService.getGameLobby(gameId);

        if (lobby.getHost().equals(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Host cannot leave the game using this endpoint"));
        }

        if (!lobby.playerExists(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "User is not in the game"));
        }

        lobby.removePlayer(username);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "leaveGameSuccess"));
    }

    //@CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/startGame")
    public ResponseEntity<Map<String, Object>> startGame(@RequestBody Map<String, String> request, @RequestParam String gameId){
        String username = request.get("username");

        if (!lobbyService.lobbyExists(gameId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        GameLobby lobby = lobbyService.getGameLobby(gameId);

        if (!lobby.getHost().equals(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Non-host player cannot start the game"));
        }

        if (!lobby.playerExists(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "User is not in the game"));
        }

        String country = "";
        if ("SpyQ".equals(lobby.getGameChoice())) {
            // Fetch country data
            // Note: You may need to add error handling for the HTTP request
            // and adjust the URL based on the actual endpoint you are using.
            String countryEndpoint = "https://restcountries.com/v3.1/region/europe";
            List<Map<String, Map<String, String>>> jsonData = restTemplate.getForObject(countryEndpoint, List.class);
            // Choose a random country
            int randomIndex = new Random().nextInt(jsonData.size());
            country = jsonData.get(randomIndex).get("name").get("common");

            // Spy game logic
            String spyName = lobby.getPlayers().get(new Random().nextInt(lobby.getPlayers().size())).getUsername();


            SpyQData.VotingObject[] votingObject = lobby.getPlayers().stream()
                    .map(player -> new SpyQData.VotingObject(player.getUsername(), 0))
                    .toArray(SpyQData.VotingObject[]::new);

            SpyQData.HasVoted[] hasVoted = lobby.getPlayers().stream()
                    .map(player -> new SpyQData.HasVoted(player.getUsername(),false))
                    .toArray(SpyQData.HasVoted[]::new);
            boolean foundSpy = false;

            // Set game end time (2 minutes by default)
            long currentTime = System.currentTimeMillis();
            long endTime = System.currentTimeMillis() + 30000 - currentTime;

            // Set vote end time (1 minute by default)
            long endVoteTime = endTime + 30000;

            endTime = endTime / 1000;
            endVoteTime = endVoteTime / 1000;

            // Set game data
            SpyQData lobbyData = new SpyQData(spyName, country, Arrays.asList(votingObject), Arrays.asList(hasVoted), foundSpy, endTime, endVoteTime);
            lobbyService.addLobbyData(gameId, lobbyData);
        }

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "startGameSuccess"));
    }

    //@CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/spyQVote")
    public ResponseEntity<Map<String, Object>> spyQVote(@RequestBody Map<String, String> request, @RequestParam String gameId) {
        String username = request.get("username");
        String votedFor = request.get("votedFor");

        if (!lobbyService.lobbyExists(gameId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        GameLobby lobby = lobbyService.getGameLobby(gameId);
        if (lobby.getGameChoice().equals("SpyQ")) {
            SpyQData lobbyData = (SpyQData) lobbyService.getLobbyData(gameId);
            if(lobbyData.hasPlayerVoted((username))) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Player: " + username + " already voted"));
            }

            lobbyData.setVoted(username);
            lobbyData.incrementVotes(votedFor);

            if(lobbyData.everyoneHasVoted()){
                if(lobbyData.getSpyName().equals(lobbyData.getPlayerMostVotes())) {
                    lobbyData.setFoundSpy(true);
                }
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "spyQVoteSuccessDone"));
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "spyQVoteSuccess"));
    }

    //@CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/gameData")
    public ResponseEntity<Map<String, Object>> gameDataHandle(@RequestParam String gameId, @RequestParam String username) {

        if (!lobbyService.lobbyExists(gameId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Game with ID: " + gameId + " not found"));
        }

        GameLobby lobby = lobbyService.getGameLobby(gameId);
        String gameChoice = lobby.getGameChoice();

        if (!lobby.playerExists(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "User is not in the game"));
        }

        if(gameChoice.equals("SpyQ")) {
            SpyQData spyQData = (SpyQData) lobbyService.getLobbyData(gameId);
            if(spyQData == null) {
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "getGameDataSuccess", "data", lobby));
            }

            String country      = spyQData.getCountry();
            long endTime        = spyQData.getEndTime();
            long endVoteTime    = spyQData.getEndVoteTime();
            List<SpyQData.VotingObject> votingObject = spyQData.getVotingObjectList();
            boolean foundSpy    = spyQData.foundSpy;
            String spy          = spyQData.getSpyName();

            GameDataMessage gameDataMessage = new GameDataMessage("", endTime, endVoteTime, false, "", new ArrayList<SpyQData.VotingObject>() );

            if(spyQData.everyoneHasVoted()) {
                spyQData.sortVotingObjectsByVotes();
                gameDataMessage.setVotingObject(votingObject);

                assert username != null;
                if (!username.equals(spy)) {
                    gameDataMessage.setCountry(country);
                    gameDataMessage.setFoundSpy(foundSpy);
                    gameDataMessage.setSpyName(spy);
                }
                return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "getGameDataSuccess", "data", lobby, "gameData", gameDataMessage));
            }
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "getGameDataSuccess","data", lobby, "gameData", gameDataMessage));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "GAME MODE DOES NOT EXIST"));
    }
    // Other methods and classes as needed
}