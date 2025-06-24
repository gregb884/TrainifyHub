package org.gregb884.auth.application.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class ApplePurchaseResult {
    private boolean success;
    private boolean isSubscription;
    private String errorMessage;

}