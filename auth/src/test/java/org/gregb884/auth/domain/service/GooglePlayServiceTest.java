package org.gregb884.auth.domain.service;

import com.google.api.services.androidpublisher.AndroidPublisher;
import com.google.api.services.androidpublisher.AndroidPublisher.Purchases;
import com.google.api.services.androidpublisher.AndroidPublisher.Purchases.Products;
import com.google.api.services.androidpublisher.AndroidPublisher.Purchases.Subscriptions;
import com.google.api.services.androidpublisher.model.ProductPurchase;
import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import com.google.api.services.androidpublisher.model.SubscriptionPurchasesAcknowledgeRequest;
import org.gregb884.auth.infrastructure.service.GooglePlayService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class GooglePlayServiceTest {


    private GooglePlayService googlePlayService;
    private AndroidPublisher androidPublisher;
    private Purchases purchases;
    private Products products;
    private Subscriptions subscriptions;

    @BeforeEach
    void setUp() throws Exception {
        androidPublisher = mock(AndroidPublisher.class);
        purchases = mock(Purchases.class);
        products = mock(Products.class);
        subscriptions = mock(Subscriptions.class);

        when(androidPublisher.purchases()).thenReturn(purchases);
        when(purchases.products()).thenReturn(products);
        when(purchases.subscriptions()).thenReturn(subscriptions);

        googlePlayService = new GooglePlayService(androidPublisher);
    }

    @Test
    void shouldVerifyProductPurchase() throws Exception {
        ProductPurchase expected = new ProductPurchase();
        AndroidPublisher.Purchases.Products.Get get = mock(AndroidPublisher.Purchases.Products.Get.class);

        when(get.execute()).thenReturn(expected);
        when(products.get("pkg", "product1", "token1")).thenReturn(get);

        ProductPurchase result = googlePlayService.verifyPurchase("pkg", "product1", "token1");

        assertThat(result).isSameAs(expected);
    }

    @Test
    void shouldVerifySubscriptionPurchase() throws Exception {
        SubscriptionPurchase expected = new SubscriptionPurchase();
        AndroidPublisher.Purchases.Subscriptions.Get get = mock(AndroidPublisher.Purchases.Subscriptions.Get.class);

        when(get.execute()).thenReturn(expected);
        when(subscriptions.get("pkg", "sub1", "token2")).thenReturn(get);

        SubscriptionPurchase result = googlePlayService.verifySubscription("pkg", "sub1", "token2");

        assertThat(result).isSameAs(expected);
    }

    @Test
    void shouldAcknowledgeProductPurchase() throws Exception {
        AndroidPublisher.Purchases.Products.Acknowledge ack = mock(AndroidPublisher.Purchases.Products.Acknowledge.class);

        when(products.acknowledge("pkg", "product1", "token1", null)).thenReturn(ack);

        googlePlayService.acknowledgePurchase("pkg", "product1", "token1");

        verify(ack).execute();
    }

    @Test
    void shouldAcknowledgeSubscriptionPurchase() throws Exception {
        AndroidPublisher.Purchases.Subscriptions.Acknowledge ack = mock(AndroidPublisher.Purchases.Subscriptions.Acknowledge.class);

        when(subscriptions.acknowledge(eq("pkg"), eq("sub1"), eq("token2"), any(SubscriptionPurchasesAcknowledgeRequest.class)))
                .thenReturn(ack);

        googlePlayService.acknowledgeSubscription("pkg", "sub1", "token2");

        verify(ack).execute();
    }
}