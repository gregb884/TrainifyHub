package org.gregb884.profilemanager.application.service;

import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.port.in.ManageRequestUseCase;
import org.gregb884.profilemanager.application.port.in.PublicQueryTrainerUseCase;
import org.gregb884.profilemanager.application.port.in.UserProfileUseCase;
import org.gregb884.profilemanager.application.port.out.LocalizationPort;
import org.gregb884.profilemanager.application.port.out.NotificationPort;
import org.gregb884.profilemanager.domain.model.Request;
import org.gregb884.profilemanager.domain.repository.RequestRepositoryPort;
import org.gregb884.profilemanager.infrastructure.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ManageRequestService implements ManageRequestUseCase {


    private final PublicQueryTrainerUseCase publicQueryTrainerUseCase;
    private final UserProfileUseCase userProfileUseCase;
    private final RequestRepositoryPort requestRepository;
    private final LocalizationPort localizationPort;
    private final AuthenticatedUser authenticatedUser;
    private final NotificationPort notificationPort;


    @Override
    public void addNewRequest(long trainerId) throws Exception {

        Request request = new Request();

        request.setTrainer(publicQueryTrainerUseCase.getTrainer(trainerId));

        try {

            request.getTrainer().getId();

        } catch (Exception e){

            throw new Exception("Trainer not found");
        }
        request.setUser(userProfileUseCase.getMyProfile());

        requestRepository.save(request);

        String receivedRequest = localizationPort.getLocalizedMessage("notification.receivedRequest", authenticatedUser.getLang());
        String newRequest = localizationPort.getLocalizedMessage("notification.newRequest", authenticatedUser.getLang());


        notificationPort.sendNotification(request.getUser().getUsername(),receivedRequest);
        notificationPort.sendNotification(request.getTrainer().getUsername(),newRequest + " : " + request.getUser().getFirstName() + " " + request.getUser().getLastName());

    }


    public String deleteRequest(long requestId) throws Exception {

        Optional<Request> request = requestRepository.findByRequestIdOnlyUserIdOrTrainerId(requestId,authenticatedUser.getUserId());

        String language = authenticatedUser.getLang();
        String requestRejected = localizationPort.getLocalizedMessage("notification.requestRejected", language);
        String requestDeleted = localizationPort.getLocalizedMessage("notification.requestDeleted", language);

        if(request.isPresent()) {

            if (authenticatedUser.getUserRole().equals("ROLE_TRAINER"))
            {

                notificationPort.sendNotification(request.get().getUser().getUsername(),requestRejected + " " + request.get().getTrainer().getFirstName() + " " + request.get().getTrainer().getLastName());
                requestRepository.delete(request.get());
                return "Request deleted";
            }

            if (authenticatedUser.getUserRole().equals("ROLE_USER"))
            {
                notificationPort.sendNotification(request.get().getUser().getUsername(),requestDeleted);
                requestRepository.delete(request.get());
                return "Request deleted";
            }

            throw new Exception("User not authorized to delete request");
        }

        throw new Exception("Request not rejected");
    }


    public String acceptRequest(long requestId) throws Exception {

        String language = authenticatedUser.getLang();
        String requestAccepted = localizationPort.getLocalizedMessage("notification.requestAccepted", language);

        Optional<Request> request = requestRepository.findByRequestIdOnlyUserIdOrTrainerId(requestId,authenticatedUser.getUserId());

        if(request.isPresent()) {

            notificationPort.sendNotification(request.get().getUser().getUsername(),requestAccepted+ " " + request.get().getTrainer().getFirstName()+ " " + request.get().getTrainer().getLastName());

            request.get().setAccepted(true);
            requestRepository.save(request.get());

            return "Request accepted";
        }

        throw new Exception("Request not accepted");
    }


}
