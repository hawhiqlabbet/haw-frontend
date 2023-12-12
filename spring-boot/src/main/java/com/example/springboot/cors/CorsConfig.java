package com.example.springboot.cors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.net.InetAddress;
import java.util.Arrays;

@Configuration
public class CorsConfig {

    private final String hostIp;

    public CorsConfig() {
        try {
            this.hostIp = InetAddress.getLocalHost().getHostAddress();
        }
        catch (Exception e){
            System.err.println(e);
        }
    }
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(Arrays.asList("http://localhost:4200", this.hostIp)); // Add your dynamic origin here
            config.addAllowedMethod("*");
            config.addAllowedHeader("*");
            return config;
        };
    }
}
