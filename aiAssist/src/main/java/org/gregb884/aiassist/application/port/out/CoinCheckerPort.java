package org.gregb884.aiassist.application.port.out;

public interface CoinCheckerPort {

    void userHasCoin() throws Exception;

    boolean coinConsume() throws Exception;

}
