package com.cars.cars.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
    private String firstName;
    private String lastName;

    @Column(name = "totp_secret")
    @JsonIgnore
    private String totpSecret;
    
    @Column(name = "totp_enabled", nullable = false, columnDefinition = "boolean default false")
    private Boolean totpEnabled = false;

    @Column(name = "totp_verified", nullable = false, columnDefinition = "boolean default false")
    private Boolean totpVerified = false;

    private String resetPasswordToken;    
    private LocalDateTime resetPasswordExpiry;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"user", "hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Reservation> reservations = new HashSet<>();

    private String profileImage;

    public boolean isTotpEnabled() {
        return totpEnabled != null && totpEnabled;
    }
    
    public boolean isTotpVerified() {
        return totpVerified != null && totpVerified;
    }
    
    public void setTotpEnabled(boolean enabled) {
        this.totpEnabled = enabled;
    }
    
    public void setTotpVerified(boolean verified) {
        this.totpVerified = verified;
    }
    
    // @Override
    // public Collection<? extends GrantedAuthority> getAuthorities() {
    //     return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    // }

    // @Override
    // public String getUsername() {
    //     return email;
    // }

    // @Override
    // public boolean isAccountNonExpired() {
    //     return true;
    // }

    // @Override
    // public boolean isAccountNonLocked() {
    //     return true;
    // }

    // @Override
    // public boolean isCredentialsNonExpired() {
    //     return true;
    // }

    // @Override
    // public boolean isEnabled() {
    //     return true;
    // }
}