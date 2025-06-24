package org.gregb884.auth.application.port.in;

import org.springframework.http.ResponseEntity;

public interface AiCoinUseCase {
    Integer checkAiCoins();
    boolean consumeAiCoin();
    boolean addOneAiCoin();
}