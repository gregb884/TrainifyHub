package org.gregb884.trainingmanager.application.port.in;

import org.gregb884.trainingmanager.application.dto.UserDto;
import org.gregb884.trainingmanager.domain.model.User;

import java.util.List;
import java.util.Set;

public interface UserUseCase {


    String getTrainerEmailById(long id) throws Exception;
    boolean saveNewUser(UserDto userDto);
    Set<User> findByUserName(String email);
    User findById(long id);
    boolean deleteUser();

}
