package org.gregb884.profilemanager.application.port.in;

public interface ManageRequestUseCase {


    void addNewRequest(long trainerId) throws Exception;
    String deleteRequest(long requestId) throws Exception;
    String acceptRequest(long requestId) throws Exception;

}
