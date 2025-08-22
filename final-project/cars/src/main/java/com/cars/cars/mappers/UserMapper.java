package com.cars.cars.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.cars.cars.dto.SignUpDto;
import com.cars.cars.dto.UserDto;
import com.cars.cars.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reservations", ignore = true)
    User signUpToUser(SignUpDto userDto);
}