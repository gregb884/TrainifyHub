package org.gregb884.auth.infrastructure.adapter.out.external;

import org.gregb884.auth.application.dto.ResponseFromOtherModuleDto;
import org.gregb884.auth.application.dto.UserDto;
import org.gregb884.auth.application.dto.UserDtoForCreateInOtherModule;
import org.gregb884.auth.application.port.out.ExternalUserModulePort;
import org.gregb884.auth.domain.model.User;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExternalUserModuleClient implements ExternalUserModulePort {

    private final RestTemplate restTemplate;

    public ExternalUserModuleClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    String userServiceUrlTrainingModule = "http://TRAININGMANAGER/api/user/create";
    String deleteUserServiceUrlTrainingModule = "http://TRAININGMANAGER/api/user/delete";
    String userServiceUrlNotificationModule = "http://NOTIFICATION/api/user/create";
    String deleteUserServiceUrlNotificationModule = "http://NOTIFICATION/api/user/delete";
    String userServiceUrlProfileTrainerModule = "http://PROFILEMANAGER/api/profile/trainer/create";
    String deleteUserServiceUrlProfileTrainerModule = "http://PROFILEMANAGER/api/profile/trainer/delete";
    String userServiceUrlProfileUserModule = "http://PROFILEMANAGER/api/profile/user/create";
    String deleteUserServiceUrlProfileUserModule = "http://PROFILEMANAGER/api/profile/user/delete";
    String userServiceUrlMessengerModule = "http://MESSENGER/api/user/create";
    String deleteUserServiceUrlMessengerModule = "http://MESSENGER/api/user/delete";
    String userServiceUrlStatisticalModule = "http://STATISTIC/api/user/create";
    String deleteUserServiceUrlStatisticalModule = "http://STATISTIC/api/user/delete";

    @Override
    public ResponseFromOtherModuleDto saveInOtherModules(UserDtoForCreateInOtherModule dto, User user, UserDto userDto, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        try {
            restTemplate.exchange(userServiceUrlTrainingModule,
                    HttpMethod.POST, new HttpEntity<>(dto, headers), String.class);
        } catch (Exception e) {
            deleteInAllModules(user,token);
            return new ResponseFromOtherModuleDto("Error saving user in Module Training Manager");
        }

        try {
            restTemplate.exchange(userServiceUrlNotificationModule,
                    HttpMethod.POST, new HttpEntity<>(dto, headers), String.class);
        } catch (Exception e) {
            deleteInAllModules(user,token);
            return new ResponseFromOtherModuleDto("Error saving user in Module Notification Manager");
        }

        try {
            restTemplate.exchange(userServiceUrlMessengerModule,
                    HttpMethod.POST, new HttpEntity<>(dto, headers), String.class);
        } catch (Exception e) {
            deleteInAllModules(user,token);
            return new ResponseFromOtherModuleDto("Error saving user in Module Messenger");
        }

        try {
            restTemplate.exchange(userServiceUrlStatisticalModule,
                    HttpMethod.POST, new HttpEntity<>(dto, headers), String.class);
        } catch (Exception e) {
            deleteInAllModules(user,token);
            return new ResponseFromOtherModuleDto("Error saving user in Module Statistic");
        }

        if (userDto.getRole().equals("TRAINER"))
        {
            try {
                restTemplate.exchange(userServiceUrlProfileTrainerModule,
                        HttpMethod.POST, new HttpEntity<>(dto, headers), String.class);
            } catch (Exception e) {
                deleteInAllModules(user,token);
                return new ResponseFromOtherModuleDto("Error saving user in Profile Manager (Trainer)");
            }
        }

        if (userDto.getRole().equals("USER"))
        {
            try {
                restTemplate.exchange(userServiceUrlProfileUserModule,
                        HttpMethod.POST, new HttpEntity<>(dto, headers), String.class);
            } catch (Exception e) {
                deleteInAllModules(user,token);
                return new ResponseFromOtherModuleDto("Error saving user in Profile Manager (User)");
            }
        }

        return new ResponseFromOtherModuleDto("Success");
    }

    @Override
    public List<String> deleteInAllModules(User user, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        List<String> errors = new ArrayList<>();

        try {
            restTemplate.exchange(deleteUserServiceUrlTrainingModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
        } catch (Exception e) {
            errors.add("Error deleting user in Module Training Manager");
        }

        try {
            restTemplate.exchange(deleteUserServiceUrlNotificationModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
        } catch (Exception e) {
            errors.add("Error deleting user in Module Notification Manager");
        }

        try {
            restTemplate.exchange(deleteUserServiceUrlStatisticalModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
        } catch (Exception e) {
            errors.add("Error deleting user in Module Statistic");
        }

        try {
            restTemplate.exchange(deleteUserServiceUrlMessengerModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
        } catch (Exception e) {
            errors.add("Error deleting user in Module Messenger");
        }

        if (user.getRole().equals("TRAINER")) {
            try {
                restTemplate.exchange(deleteUserServiceUrlProfileTrainerModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
            } catch (Exception e) {
                errors.add("Error deleting user in Profile Module (Trainer)");
            }

        }

        if (user.getRole().equals("USER")) {
            try {
                restTemplate.exchange(deleteUserServiceUrlProfileUserModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
            } catch (Exception e) {
                errors.add("Error deleting user in Profile Module (User)");
            }

        }

        return errors;

    }

}