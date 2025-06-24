package org.gregb884.auth.application.port.out;

import org.gregb884.auth.application.dto.ResponseFromOtherModuleDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.dto.UserDtoForCreateInOtherModule;
import org.gregb884.auth.domain.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ExternalUserModulePort {


    ResponseFromOtherModuleDto saveInOtherModules(UserDtoForCreateInOtherModule dto, User user, UserDto userDto, String token);
    List<String> deleteInAllModules(User user, String token);
}