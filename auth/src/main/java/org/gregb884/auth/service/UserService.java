package org.gregb884.auth.service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import org.gregb884.auth.dto.UserDto;
import org.gregb884.auth.dto.UserDtoForCreateInOtherModule;
import org.gregb884.auth.model.User;
import org.gregb884.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecretKey secretKey;
    private final long expiration;
    private final RestTemplate restTemplate;
    private final EmailService emailService;
    private final LocalizationService localizationService;
    private final AppleTokenVerifierService appleTokenVerifierService;

    @Value("${google.clientid}")
    private String clientId;

    @Value("${google.clientIdIos}")
    private String clientIosId;

    public UserService(UserRepository userRepository, @Value("${jwt.secret}") String secret, @Value("${jwt.expirtation}") long expiration, RestTemplate restTemplate, EmailService emailService, LocalizationService localizationService, AppleTokenVerifierService appleTokenVerifierService) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.emailService = emailService;
        this.localizationService = localizationService;
        this.appleTokenVerifierService = appleTokenVerifierService;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = expiration;
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


    private ResponseEntity<String> saveInOtherModule(UserDtoForCreateInOtherModule userDtoForCreateInOtherModule , User user , UserDto userDto , String token ) {


        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        try {
            restTemplate.exchange(userServiceUrlTrainingModule,
                    HttpMethod.POST, new HttpEntity<>(userDtoForCreateInOtherModule, headers), String.class);
        } catch (Exception e) {
            deleteUserInAllModules(user);
            return ResponseEntity.badRequest().body("Error saving user in Module Training Manager");
        }

        try {
            restTemplate.exchange(userServiceUrlNotificationModule,
                    HttpMethod.POST, new HttpEntity<>(userDtoForCreateInOtherModule, headers), String.class);
        } catch (Exception e) {
            deleteUserInAllModules(user);
            return ResponseEntity.badRequest().body("Error saving user in Module Notification Manager");
        }

        try {
            restTemplate.exchange(userServiceUrlMessengerModule,
                    HttpMethod.POST, new HttpEntity<>(userDtoForCreateInOtherModule, headers), String.class);
        } catch (Exception e) {
            deleteUserInAllModules(user);
            return ResponseEntity.badRequest().body("Error saving user in Module Messenger");
        }

        try {
            restTemplate.exchange(userServiceUrlStatisticalModule,
                    HttpMethod.POST, new HttpEntity<>(userDtoForCreateInOtherModule, headers), String.class);
        } catch (Exception e) {
            deleteUserInAllModules(user);
            return ResponseEntity.badRequest().body("Error saving user in Module Statistic");
        }

        if (userDto.getRole().equals("TRAINER"))
        {
            try {
                restTemplate.exchange(userServiceUrlProfileTrainerModule,
                        HttpMethod.POST, new HttpEntity<>(userDtoForCreateInOtherModule, headers), String.class);
            } catch (Exception e) {
                deleteUserInAllModules(user);
                return ResponseEntity.badRequest().body("Error saving user in Profile Manager (Trainer)");
            }
        }

        if (userDto.getRole().equals("USER"))
        {
            try {
                restTemplate.exchange(userServiceUrlProfileUserModule,
                        HttpMethod.POST, new HttpEntity<>(userDtoForCreateInOtherModule, headers), String.class);
            } catch (Exception e) {
                deleteUserInAllModules(user);
                return ResponseEntity.badRequest().body("Error saving user in Profile Manager (User)");
            }
        }


        return null;
    }


    @Transactional
    public ResponseEntity<String> saveUser(UserDto userDto) {

        if (userDto.getLang() == null ||
                userDto.getLang().isEmpty() ||
                !(userDto.getLang().equals("en") ||
                        userDto.getLang().equals("pl") ||
                        userDto.getLang().equals("de"))) {

            return ResponseEntity.badRequest().body("Not a valid language");

        }

        if (userDto.getRole() == null ||
                userDto.getRole().isEmpty() ||
                !(userDto.getRole().equals("TRAINER") ||
                        userDto.getRole().equals("USER"))) {

            return ResponseEntity.badRequest().body("Not a valid role");
        }

        if (userRepository.existsUserByUsername(userDto.getUsername())) {


            if (userRepository.findByUsername(userDto.getUsername()).isGoogleAccount())
            {

                return ResponseEntity.badRequest().body("Username login google");
            }

            return ResponseEntity.badRequest().body("Username already exists");

        }

        String activationToken = generateActivationToken();

        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(userDto.getRole());
        user.setLang(userDto.getLang());
        user.setBanned(false);
        user.setActivationToken(activationToken);
        userRepository.save(user);

        String token = generateToken(user);


        UserDtoForCreateInOtherModule userDtoForCreateInOtherModule = new UserDtoForCreateInOtherModule();

        userDtoForCreateInOtherModule.setUsername(userDto.getUsername());
        userDtoForCreateInOtherModule.setId(user.getId());
        userDtoForCreateInOtherModule.setFirstName(userDto.getFirstName());
        userDtoForCreateInOtherModule.setLastName(userDto.getLastName());
        userDtoForCreateInOtherModule.setRegion(userDto.getLang());


       ResponseEntity<String> responseFromOtherModule = saveInOtherModule(userDtoForCreateInOtherModule,user,userDto,token);


        if (responseFromOtherModule != null) {

            return responseFromOtherModule;
        }


        try {

            String localizedMessageBody = localizationService.getLocalizedMessage("email.activation", user.getLang());
            String localizedMessageSubject = localizationService.getLocalizedMessage("email.subject", user.getLang());
            String activationLink = "http://localhost:3000/login?token=" + activationToken;
            String emailBody = localizedMessageBody + " " + activationLink;

            emailService.sendEmail(user.getUsername(),localizedMessageSubject, emailBody);

        } catch (Exception e) {

            deleteUserInAllModules(user);
            return ResponseEntity.badRequest().body("Error email send");
        }



        return ResponseEntity.ok("Created user '" + userDto.getUsername() + "' successfully");
    }



    public ResponseEntity<String> deleteUserInAllModules(User user) {

            String token = generateToken(user);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

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

                userRepository.deleteById(user.getId());

            }

            if (user.getRole().equals("USER")) {
                try {
                    restTemplate.exchange(deleteUserServiceUrlProfileUserModule, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
                } catch (Exception e) {
                    errors.add("Error deleting user in Profile Module (User)");
                }

                userRepository.deleteById(user.getId());

            }

            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(String.join(", ", errors));
            }

            userRepository.deleteById(user.getId());

            return ResponseEntity.ok("Deleted user successfully");


    }

    public void newLogin(User user){

        if(user.getLoginCount() != null){

            user.setLoginCount(user.getLoginCount() + 1);
        }

        if (user.getLoginCount() == null){

            user.setLoginCount(0);
        }


        userRepository.save(user);
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", "ROLE_" + user.getRole());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("premium", user.isPremium());
        claims.put("verified", user.isVerified());
        claims.put("id",user.getId());
        claims.put("lang",user.getLang());

        newLogin(user);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword()) && user.isVerified()) {
            return user;
        }
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }

    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userIdObj = jwtAuthenticationToken.getTokenAttributes().get("id");

            if (userIdObj instanceof Integer) {
                return ((Integer) userIdObj).longValue();
            } else if (userIdObj instanceof Long) {
                return (Long) userIdObj;
            } else if (userIdObj instanceof String) {
                return Long.valueOf((String) userIdObj);
            } else {
                throw new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
            }
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }

    public String getUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userIdObj = jwtAuthenticationToken.getTokenAttributes().get("sub");

          if (userIdObj instanceof String) {
                return userIdObj.toString();
            } else {
                throw new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
            }
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }



    public String getRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new IllegalStateException("No authentication information found");
        }


        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object roleObj = jwtAuthenticationToken.getTokenAttributes().get("roles");

            if (roleObj instanceof String) {
                return (String) roleObj;
            } else {
                throw new IllegalStateException("Unexpected type of roles in token: " + roleObj.getClass().getName());
            }
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        if (roles.contains("TRAINER")) {
            return "TRAINER";
        } else {
            throw new IllegalStateException("User does not have the required role");
        }
    }


    public boolean checkExist(String userName) {

        if (!getRole().equals("ROLE_TRAINER"))
        {
            return false;
        }

        return userRepository.existsUserByUsername(userName);
    }

    public ResponseEntity<String> deleteAllUsers() {

        List<User> users = userRepository.findAll();

        for (User user : users) {

            deleteUserInAllModules(user);
        }
        return ResponseEntity.ok("Deleted all users");

    }

    public ResponseEntity<String> deleteUser(long userId) {


        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {

            deleteUserInAllModules(user.get());

            return ResponseEntity.ok("Deleted user");
        }

        return ResponseEntity.badRequest().body("User not found");

    }


    public ResponseEntity<String> readyPlansAccessCheck() {
        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {
            Date accessEndDate = user.get().getReadyMadePlansAccess();

            if (accessEndDate == null) {
                return ResponseEntity.badRequest().body("Access denied");
            }

            Instant accessEndInstant = accessEndDate.toInstant();

            Instant nowInstant = Instant.now();

            if (!nowInstant.isAfter(accessEndInstant)) {
                return ResponseEntity.ok("Access");
            } else {
                return ResponseEntity.badRequest().body("Access check");
            }
        }

        return ResponseEntity.badRequest().body("Access denied");
    }

    public ResponseEntity<String> checkAiCoins() {


        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            if (user.get().getAiCoins() == null){

                return ResponseEntity.ok("0");

            }

            return ResponseEntity.ok(user.get().getAiCoins().toString());

        }

        return ResponseEntity.badRequest().body("User not found");

    }

    public ResponseEntity<String> consumeAiCoin() {

        Optional<User> user = userRepository.findById(getUserId());


        if (user.isPresent()) {

            int coins = user.get().getAiCoins();

            if (coins > 0) {

                user.get().setAiCoins(--coins);

                userRepository.save(user.get());

                return ResponseEntity.ok("Consumed");

            }

            return ResponseEntity.badRequest().body("Not consumed");

        }

        return ResponseEntity.badRequest().body("User not found");
    }


    public String generateActivationToken() {
        return UUID.randomUUID().toString();
    }

    public ResponseEntity<String> loginCount() {


        Optional<Integer> loginCount = userRepository.countLoginById(getUserId());

        return loginCount.map(integer -> ResponseEntity.ok(integer.toString())).orElseGet(() -> ResponseEntity.ok("0"));


    }

    public ResponseEntity<Void> loginPlus() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            user.get().setLoginCount(user.get().getLoginCount() + 1);

            userRepository.save(user.get());

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.badRequest().build();

    }


    public ResponseEntity<String> newUserDataFill(String token , UserDto userDto) {



        if (userDto.getLang() == null ||
                userDto.getLang().isEmpty() ||
                !(userDto.getLang().equals("en") ||
                        userDto.getLang().equals("pl") ||
                        userDto.getLang().equals("de"))) {

            return ResponseEntity.badRequest().body("Not a valid language");

        }

        if (userDto.getRole() == null ||
                userDto.getRole().isEmpty() ||
                !(userDto.getRole().equals("TRAINER") ||
                        userDto.getRole().equals("USER"))) {

            return ResponseEntity.badRequest().body("Not a valid role");
        }

        try {

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Arrays.asList(
                            clientId,
                            clientIosId
                    ))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                Optional<User> existingUser = userRepository.findByUsernameOptional(email);

                if (existingUser.isPresent()) {

                    existingUser.get().setRole(userDto.getRole());
                    existingUser.get().setLang(userDto.getLang());
                    existingUser.get().setFirstName(userDto.getFirstName());
                    existingUser.get().setLastName(userDto.getLastName());
                    existingUser.get().setVerified(true);
                    existingUser.get().setLoginCount(0);

                    userRepository.save(existingUser.get());

                    String authenticateToken = generateToken(existingUser.get());

                    UserDtoForCreateInOtherModule userDtoForCreateInOtherModule = new UserDtoForCreateInOtherModule();

                    userDtoForCreateInOtherModule.setUsername(existingUser.get().getUsername());
                    userDtoForCreateInOtherModule.setId(existingUser.get().getId());
                    userDtoForCreateInOtherModule.setFirstName(userDto.getFirstName());
                    userDtoForCreateInOtherModule.setLastName(userDto.getLastName());
                    userDtoForCreateInOtherModule.setRegion(userDto.getLang());


                    ResponseEntity<String> responseFromOtherModule = saveInOtherModule(userDtoForCreateInOtherModule,existingUser.get(),userDto,authenticateToken);

                    if (responseFromOtherModule != null) {

                        return responseFromOtherModule;
                    }


                    return ResponseEntity.ok(authenticateToken);
                }

            } else {

                throw new Exception("Token Google is Null");
            }

        }catch (Exception e){

            try {

                String emailFromApple = appleTokenVerifierService.verify(token);


                if (emailFromApple != null) {

                    Optional<User> existingUser = userRepository.findByUsernameOptional(emailFromApple);

                    if (existingUser.isPresent()) {

                        existingUser.get().setRole(userDto.getRole());
                        existingUser.get().setLang(userDto.getLang());
                        existingUser.get().setFirstName(userDto.getFirstName());
                        existingUser.get().setLastName(userDto.getLastName());
                        existingUser.get().setVerified(true);
                        existingUser.get().setLoginCount(0);

                        userRepository.save(existingUser.get());

                        String authenticateToken = generateToken(existingUser.get());

                        UserDtoForCreateInOtherModule userDtoForCreateInOtherModule = new UserDtoForCreateInOtherModule();

                        userDtoForCreateInOtherModule.setUsername(existingUser.get().getUsername());
                        userDtoForCreateInOtherModule.setId(existingUser.get().getId());
                        userDtoForCreateInOtherModule.setFirstName(userDto.getFirstName());
                        userDtoForCreateInOtherModule.setLastName(userDto.getLastName());
                        userDtoForCreateInOtherModule.setRegion(userDto.getLang());


                        ResponseEntity<String> responseFromOtherModule = saveInOtherModule(userDtoForCreateInOtherModule,existingUser.get(),userDto,authenticateToken);

                        if (responseFromOtherModule != null) {

                            return responseFromOtherModule;
                        }


                        return ResponseEntity.ok(authenticateToken);
                    }

                } else {

                    return ResponseEntity.badRequest().body("Token is Null");
                }


            } catch (Exception exceptionApple){

                return ResponseEntity.badRequest().body(exceptionApple.getMessage());

            }


            return ResponseEntity.badRequest().body(e.getMessage());

        }

        return ResponseEntity.badRequest().build();

    }



    @Transactional
    public ResponseEntity<?> googleLogin(String token) {

        try {

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), JacksonFactory.getDefaultInstance()
            )
                    .setAudience(Arrays.asList(
                            clientId,
                            clientIosId
                    ))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();

                Optional<User> existingUser = userRepository.findByUsernameOptional(email);
                if (existingUser.isPresent()) {
                    User user = existingUser.get();
                    boolean isProfileComplete = (user.getLang() != null && user.getRole() != null);

                    if (isProfileComplete) {

                        String authenticateToken = generateToken(existingUser.get());

                        return ResponseEntity.ok("token:"+authenticateToken);

                    }
                    else {

                        return ResponseEntity.ok("newUser");

                    }
                }

                User newUser = new User();
                newUser.setUsername(email);
                newUser.setGoogleAccount(true);
                userRepository.save(newUser);

                return ResponseEntity.ok("newUser");

            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error token Google");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail " + e.getMessage());
        }
    }


    private boolean googleAccountExist(String username){

        Optional<User> user = userRepository.findByUsernameOptional(username);

        if (user.isPresent()) {

            if (user.get().isGoogleAccount()){

                return true;

            }

            return false;

        }

        return false;

    }


    public ResponseEntity<String> login(UserDto user) {

        User authenticatedUser = authenticate(user.getUsername(), user.getPassword());
        if (authenticatedUser != null && !authenticatedUser.isBanned()) {
            String token = generateToken(authenticatedUser);
            return ResponseEntity.ok(token);
        }

        if (authenticatedUser != null && authenticatedUser.isBanned()){

            return ResponseEntity.status(401).body("Banned Account");
        }

        if (googleAccountExist(user.getUsername())){


            return ResponseEntity.status(401).body("googleAccountExist");

        }


        return ResponseEntity.status(401).body("Invalid username, password or account not active");

    }

    public String checkLang(String userName) {


        Optional<User> user = userRepository.findByUsernameOptional(userName);

        if (user.isPresent()){

            return user.get().getLang();
        }

        return "";


    }

    public ResponseEntity<String> deleteMyAccount() {

        Optional<User> user = userRepository.findById(getUserId());
        if (user.isPresent()) {

            deleteUserInAllModules(user.get());

            return ResponseEntity.ok("Deleted");
        }

        return ResponseEntity.badRequest().body("User not found");

    }

    public boolean addOneAiCoin() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent()) {

            if (user.get().getAiCoins() == null){

                user.get().setAiCoins(1);

                userRepository.save(user.get());

                return true;
            }

            if (user.get().getAiCoins() != null){

                user.get().setAiCoins(user.get().getAiCoins() + 1);

                userRepository.save(user.get());

                return true;
            }

            return false;
        }

        return false;

    }


    public boolean changeTimeExpireSubscription(Long expiryTimeMillis, String zone) {

        try {

            Optional<User> user = userRepository.findById(getUserId());

            if (user.isPresent()) {

                Instant expiryInstant = Instant.ofEpochMilli(expiryTimeMillis);

                ZoneId zoneId = (zone != null && !zone.isEmpty()) ? ZoneId.of(zone) : ZoneId.of("UTC");

                ZonedDateTime expiryDateTimeUser = expiryInstant.atZone(zoneId);

                Date expiryDate = Date.from(expiryDateTimeUser.toInstant());

                user.get().setReadyMadePlansAccess(expiryDate);

                userRepository.save(user.get());

                return true;

            }

        } catch (Exception e){

            return false;

        }

        return false;

    }

    public String getLang() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
            Object userIdObj = jwtAuthenticationToken.getTokenAttributes().get("lang");

            if (userIdObj instanceof String) {
                return userIdObj.toString();
            } else {
                throw new IllegalStateException("Unexpected type of id in token: " + userIdObj.getClass().getName());
            }
        }

        throw new IllegalStateException("Authentication token is not a JWT token");
    }

    public ResponseEntity<?> appleLogin(String token) {

        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("empty token");
        }

        try {

            String email = appleTokenVerifierService.verify(token);

            if (email != null){

                Optional<User> existingUser = userRepository.findByUsernameOptional(email);
                if (existingUser.isPresent()) {
                    User user = existingUser.get();
                    boolean isProfileComplete = (user.getLang() != null && user.getRole() != null);

                    if (isProfileComplete) {

                        String authenticateToken = generateToken(existingUser.get());

                        return ResponseEntity.ok("token:"+authenticateToken);

                    }
                    else {

                        return ResponseEntity.ok("newUser");

                    }
                }

                User newUser = new User();
                newUser.setUsername(email);
                newUser.setAppleAccount(true);
                userRepository.save(newUser);

                return ResponseEntity.ok("newUser");

            } else return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Fail Authorization ");


        } catch (Exception e){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Fail " + e.getMessage());
        }

    }

    public ResponseEntity<String> subscriptionEndDate() {

        Optional<User> user = userRepository.findById(getUserId());

        if (user.isPresent() && user.get().getReadyMadePlansAccess() != null) {

           return ResponseEntity.ok(user.get().getReadyMadePlansAccess().toString());
        }

        return ResponseEntity.badRequest().body("Null");

    }
}

