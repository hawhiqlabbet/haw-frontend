package com.example.springboot.socketIO;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class ServerCommandLineRunner implements CommandLineRunner {
    @Autowired
    private final SocketIOServer server;

    // Default constructor to satisfy Lombok's @RequiredArgsConstructor
    public ServerCommandLineRunner() {
        this.server = null; // Initialize with an appropriate value or leave it null
    }
    @Override
    public void run(String... args) throws Exception {
        server.start();
    }
}