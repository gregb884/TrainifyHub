package org.gregb884.auth;

import org.gregb884.auth.application.port.in.PurchaseUseCase;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.gregb884.auth.infrastructure.service.UserAccountService;
import org.gregb884.auth.infrastructure.adapter.in.controller.UserDeleteController;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
class AuthApplicationTests {


    @MockBean
    private GooglePurchaseVerifierPort googlePurchaseVerifierPort;

    @MockBean
    private PurchaseUseCase purchaseUseCase;

    @MockBean
    private UserAccountService userAccountService;

    @MockBean
    private UserDeleteController userDeleteController;


    @Test
    void contextLoads() {
    }

}
