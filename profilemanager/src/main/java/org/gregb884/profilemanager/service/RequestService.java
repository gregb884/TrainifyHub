package org.gregb884.profilemanager.service;

import org.gregb884.profilemanager.dto.RequestDto;
import org.gregb884.profilemanager.mapper.Mappers;
import org.gregb884.profilemanager.model.Request;
import org.gregb884.profilemanager.repository.RequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final TrainerService trainerService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final LocalizationService localizationService;


    public RequestService(RequestRepository requestRepository, TrainerService trainerService, UserService userService, RestTemplate restTemplate, NotificationService notificationService, LocalizationService localizationService) {
        this.requestRepository = requestRepository;
        this.trainerService = trainerService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.localizationService = localizationService;
    }


    public ResponseEntity<String> addNewRequest(long trainerId) {

        Request request = new Request();

        request.setTrainer(trainerService.getTrainer(trainerId));

        try {

            request.getTrainer().getId();

        } catch (Exception e){

            return ResponseEntity.badRequest().body("Trainer not found");
        }
        request.setUser(userService.getUser(userService.getUserId()));
        requestRepository.save(request);

        String language = userService.getLang();
        String receivedRequest = localizationService.getLocalizedMessage("notification.receivedRequest", language);
        String newRequest = localizationService.getLocalizedMessage("notification.newRequest", language);


        notificationService.sendNotification(request.getUser().getUsername(),receivedRequest);
        notificationService.sendNotification(request.getTrainer().getUsername(),newRequest + " : " + request.getUser().getFirstName() + " " + request.getUser().getLastName());

        return ResponseEntity.ok("Request added");
    }



    public ResponseEntity<Page<RequestDto>> myRequest(int page , int size , String search) {

        long userId = userService.getUserId();

        String searchToLowerCase = search.toLowerCase();

        Pageable pageable = PageRequest.of(page, size);

        Page<Request> requests = requestRepository.findAllByUserIdAndTrainerIdPage(userId,searchToLowerCase,pageable);

        return ResponseEntity.ok(requests.map(Mappers::toRequestDto));
    }

    public ResponseEntity<String> deleteRequest(long requestId) {

        Optional<Request> request = requestRepository.findByRequestIdOnlyUserIdOrTrainerId(requestId,userService.getUserId());

        String language = userService.getLang();
        String requestRejected = localizationService.getLocalizedMessage("notification.requestRejected", language);
        String requestDeleted = localizationService.getLocalizedMessage("notification.requestDeleted", language);

        if(request.isPresent()) {

            if (userService.getUserRole().equals("ROLE_TRAINER"))
            {

                notificationService.sendNotification(request.get().getUser().getUsername(),requestRejected + " " + request.get().getTrainer().getFirstName() + " " + request.get().getTrainer().getLastName());
                requestRepository.delete(request.get());
                return ResponseEntity.ok("Request deleted");
            }

            if (userService.getUserRole().equals("ROLE_USER"))
            {
                notificationService.sendNotification(request.get().getUser().getUsername(),requestDeleted);
                requestRepository.delete(request.get());
                return ResponseEntity.ok("Request deleted");
            }

            return ResponseEntity.badRequest().body("Request not rejected");
        }

        return ResponseEntity.badRequest().body("Request not rejected");
    }

    public ResponseEntity<String> acceptRequest(long requestId) {

        String language = userService.getLang();
        String requestAccepted = localizationService.getLocalizedMessage("notification.requestAccepted", language);

        Optional<Request> request = requestRepository.findByRequestIdOnlyUserIdOrTrainerId(requestId,userService.getUserId());

        if(request.isPresent()) {

            notificationService.sendNotification(request.get().getUser().getUsername(),requestAccepted+ " " + request.get().getTrainer().getFirstName()+ " " + request.get().getTrainer().getLastName());

            request.get().setAccepted(true);
            requestRepository.save(request.get());

            return ResponseEntity.ok("Request accepted");
        }

        return ResponseEntity.badRequest().body("Request not accepted");
    }

    public ResponseEntity<String> countNewRequest() {


        if (!userService.getUserRole().equals("ROLE_TRAINER")){

            return ResponseEntity.badRequest().body("User does not have role TRAINER");
        }

        Long requestCount = requestRepository.countNewRequest(userService.getUserId());

        return ResponseEntity.ok("" + requestCount);

    }
}
