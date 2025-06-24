package org.gregb884.auth.application.port.in;

import org.gregb884.auth.application.dto.ResponseDto;
import org.springframework.http.ResponseEntity;

public interface UserAccountUseCase {
    boolean checkExist(String userName);
    String checkLang(String userName);
    ResponseDto readyPlansAccessCheck();
    ResponseDto subscriptionEndDate();
    ResponseDto loginCount();
    void loginPlus();
    ResponseDto deleteMyAccount();
}