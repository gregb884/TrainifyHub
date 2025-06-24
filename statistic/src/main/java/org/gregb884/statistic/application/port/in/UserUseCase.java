package org.gregb884.statistic.application.port.in;

import org.gregb884.statistic.application.dto.UserDto;
import org.gregb884.statistic.domain.model.User;

public interface UserUseCase {


    User getUser(long userId);
    boolean saveNewUser(UserDto userDto);
    boolean deleteUser();


}
