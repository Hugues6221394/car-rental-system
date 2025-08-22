package com.cars.cars.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
    private final UserAuthProvider userAuthProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .exceptionHandling().authenticationEntryPoint(userAuthenticationEntryPoint)
                .and()
                .addFilterBefore(new JwtAuthFilter(userAuthProvider), BasicAuthenticationFilter.class)
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .and()
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/signin",
                                "/api/auth/signup",
                                "/api/auth/signin-totp",
                                "/api/auth/totp/verify",
                                "/api/auth/totp/setup",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/auth/refresh",
                                "/api/auth/debug-totp",
                                "/api/auth//verify-totp-setup"
                        ).permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/payments/initiate").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/payments").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/payments/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/payments/**/status").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/totp/status").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/totp/**").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true);
            }
        };
    }
}