package org.gregb884.auth.domain.service;

import com.google.api.services.androidpublisher.model.ProductPurchase;
import org.gregb884.auth.application.dto.ApplePurchaseResult;
import org.gregb884.auth.application.dto.PurchaseRequestDto;
import org.gregb884.auth.application.dto.ResponseDto;
import org.gregb884.auth.application.port.in.AiCoinUseCase;
import org.gregb884.auth.application.port.out.ApplePurchaseVerifierPort;
import org.gregb884.auth.application.port.out.GooglePurchaseVerifierPort;
import org.gregb884.auth.infrastructure.service.PurchaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class PurchaseServiceTest {

    private ApplePurchaseVerifierPort appleVerifier;
    private GooglePurchaseVerifierPort googleVerifier;
    private AiCoinUseCase aiCoinUseCase;
    private PurchaseService purchaseService;

    @BeforeEach
    void setUp() {
        appleVerifier = mock(ApplePurchaseVerifierPort.class);
        googleVerifier = mock(GooglePurchaseVerifierPort.class);
        aiCoinUseCase = mock(AiCoinUseCase.class);
        purchaseService = new PurchaseService(appleVerifier, googleVerifier, aiCoinUseCase);
    }

    @Test
    void shouldConfirmGooglePurchaseWhenAlreadyConfirmed() throws IOException {
        ProductPurchase purchase = new ProductPurchase();
        purchase.setPurchaseState(1);

        when(googleVerifier.verifyPurchase("pkg", "product1", "token")).thenReturn(purchase);

        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "product1", "token");

        ResponseDto response = purchaseService.verifyGooglePurchase(dto);

        assertThat(response.getResponse()).isEqualTo("Confirm Payment");
    }

    @Test
    void shouldConfirmGooglePurchaseAndAddAiCoinWhenNotYetConfirmed() throws IOException {
        ProductPurchase purchase = new ProductPurchase();
        purchase.setPurchaseState(0);

        when(googleVerifier.verifyPurchase("pkg", "ai_custom_plan", "token")).thenReturn(purchase);
        when(aiCoinUseCase.addOneAiCoin()).thenReturn(true);

        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "ai_custom_plan", "token");

        ResponseDto response = purchaseService.verifyGooglePurchase(dto);

        assertThat(response.getResponse()).isEqualTo("Confirm Payment");
        verify(googleVerifier).acknowledgePurchase("pkg", "ai_custom_plan", "token");
    }

    @Test
    void shouldReturnErrorWhenAiCoinFails() throws IOException {
        ProductPurchase purchase = new ProductPurchase();
        purchase.setPurchaseState(0);

        when(googleVerifier.verifyPurchase("pkg", "ai_custom_plan", "token")).thenReturn(purchase);
        when(aiCoinUseCase.addOneAiCoin()).thenReturn(false);

        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "ai_custom_plan", "token");

        ResponseDto response = purchaseService.verifyGooglePurchase(dto);

        assertThat(response.getResponse()).contains("❌");
        verify(googleVerifier, never()).acknowledgePurchase(any(), any(), any());
    }

    @Test
    void shouldReturnErrorWhenGoogleThrowsException() throws IOException {
        when(googleVerifier.verifyPurchase(any(), any(), any())).thenThrow(new IOException("network error"));

        PurchaseRequestDto dto = new PurchaseRequestDto("pkg", "product1", "token");

        ResponseDto response = purchaseService.verifyGooglePurchase(dto);

        assertThat(response.getResponse()).contains("❌ Error payment confirm");
    }

    @Test
    void shouldVerifyApplePurchaseUsingPort() {
        ApplePurchaseResult expected = new ApplePurchaseResult(true, false, "");

        when(appleVerifier.verify("apple-token")).thenReturn(expected);

        PurchaseRequestDto dto = new PurchaseRequestDto(null, null, "apple-token");

        ApplePurchaseResult result = purchaseService.verifyApplePurchase(dto);

        assertThat(result).isSameAs(expected);
    }
}