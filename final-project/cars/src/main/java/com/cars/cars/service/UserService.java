package com.cars.cars.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cars.cars.dto.CredentialsDto;
import com.cars.cars.dto.LoginWithTotpDto;
import com.cars.cars.dto.SignUpDto;
import com.cars.cars.dto.TotpSetupDto;
import com.cars.cars.dto.TotpStatusDto;
import com.cars.cars.dto.UserDto;
import com.cars.cars.dto.ForgotPasswordDto;
import com.cars.cars.dto.ResetPasswordDto;
import com.cars.cars.exceptions.AppException;
import com.cars.cars.mappers.UserMapper;
import com.cars.cars.model.User;
import com.cars.cars.repository.UserRepository;

import jakarta.mail.MessagingException;

import com.cars.cars.model.Role;


import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TotpService totpService;
    private final EmailService emailService;
    private final NotificationService  notificationService;

    @Value("${totp.issuer:Cars App}")
    private String appName;

    public UserDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByEmail(credentialsDto.getEmail())
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }
        throw new AppException("Bad credentials", HttpStatus.BAD_REQUEST);
    }

    public UserDto loginWithTotp(LoginWithTotpDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(CharBuffer.wrap(loginDto.getPassword()), user.getPassword())) {
            throw new AppException("Bad credentials", HttpStatus.BAD_REQUEST);
        }

        if (!user.isTotpEnabled()) {
            throw new AppException("TOTP is not enabled for this account", HttpStatus.BAD_REQUEST);
        }

        if (!totpService.verifyCode(user.getTotpSecret(), loginDto.getTotpCode())) {
            throw new AppException("Invalid TOTP code", HttpStatus.BAD_REQUEST);
        }

        return userMapper.toUserDto(user);
    }

    public boolean isTotpEnabled(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));
        return user.isTotpEnabled();
    }

    public boolean isTotpVerified(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));
        return user.isTotpVerified();
    }

    @Transactional
    public UserDto register(SignUpDto userDto) {
        Optional<User> optionalUser = userRepository.findByEmail(userDto.getEmail());
        if (optionalUser.isPresent()) {
            throw new AppException("Email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(userDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));

        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        user.setTotpEnabled(true);
        user.setTotpVerified(false);

        User savedUser = userRepository.save(user);

        notificationService.createUserRegisteredNotification(savedUser);

        return userMapper.toUserDto(savedUser);
    }

    @Transactional
    public TotpSetupDto setupTotp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        String secret = totpService.generateSecret();
        String qrCodeDataUri = totpService.generateQrCodeDataUri(secret, email, appName);

        user.setTotpSecret(secret);
        user.setTotpEnabled(true);
        user.setTotpVerified(false);
        userRepository.save(user);

        return new TotpSetupDto(secret, qrCodeDataUri, null);
    }

    @Transactional
    public boolean verifyAndEnableTotp(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        if (user.getTotpSecret() == null) {
            throw new AppException("TOTP setup not initiated", HttpStatus.BAD_REQUEST);
        }

        boolean isValid = totpService.verifyCode(user.getTotpSecret(), code);

        if (isValid) {
            user.setTotpEnabled(true);
            user.setTotpVerified(true);
            userRepository.save(user);
        }

        return isValid;
    }

    @Transactional
    public boolean disableTotp(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        if (!user.isTotpEnabled()) {
            throw new AppException("TOTP is not enabled", HttpStatus.BAD_REQUEST);
        }

        boolean isValid = totpService.verifyCode(user.getTotpSecret(), code);

        if (isValid) {
            user.setTotpEnabled(false);
            user.setTotpVerified(false);
            user.setTotpSecret(null);
            userRepository.save(user);
        }

        return isValid;
    }

    public TotpStatusDto getTotpStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Unknown User", HttpStatus.NOT_FOUND));

        return new TotpStatusDto(user.isTotpEnabled(), user.isTotpVerified());
    }

    @Transactional
    public void requestPasswordReset(ForgotPasswordDto forgotPasswordDto) throws MessagingException {
        Optional<User> optionalUser = userRepository.findByEmail(forgotPasswordDto.getEmail());
        if (optionalUser.isEmpty()) {
            return; // Silently fail to prevent email enumeration
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordDto resetPasswordDto) {
        User user = userRepository.findByResetPasswordToken(resetPasswordDto.getToken())
                .orElseThrow(() -> new AppException("Invalid or expired reset token", HttpStatus.BAD_REQUEST));

        if (user.getResetPasswordExpiry() == null || user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException("Reset token has expired", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(resetPasswordDto.getNewPassword())));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        if (!user.getEmail().equals(userDetails.getEmail()) &&
                userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setRole(userDetails.getRole());

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public User updateUserRole(Long id, Role role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    // UserService.java
    public User getCurrentUser() {
        // Get the authentication from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDto) {
            // If principal is UserDto, get the email from it
            UserDto userDto = (UserDto) principal;
            return userRepository.findByEmail(userDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + userDto.getEmail()));
        } else if (principal instanceof String) {
            // If principal is String (username/email), use it directly
            return userRepository.findByEmail((String) principal)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + principal));
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            // If using Spring Security UserDetails
            org.springframework.security.core.userdetails.UserDetails userDetails =
                    (org.springframework.security.core.userdetails.UserDetails) principal;
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + userDetails.getUsername()));
        } else {
            throw new RuntimeException("Unknown principal type: " + principal.getClass().getName());
        }
    }

    public User findByEmailEntity(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}