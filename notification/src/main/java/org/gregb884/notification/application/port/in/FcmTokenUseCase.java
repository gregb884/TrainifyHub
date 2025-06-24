package org.gregb884.notification.application.port.in;

public interface FcmTokenUseCase {


    void addFcmToken(String fcmToken) throws Exception;
    String getFcm() throws Exception;
    void deleteFCM() throws Exception;


}
