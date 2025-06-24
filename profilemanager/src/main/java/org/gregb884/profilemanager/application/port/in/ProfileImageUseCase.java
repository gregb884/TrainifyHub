package org.gregb884.profilemanager.application.port.in;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProfileImageUseCase {


    String getUserOrTrainerImage(String userName) throws Exception;

    String saveProfileImage(MultipartFile file) throws Exception;

}
