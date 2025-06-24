package org.gregb884.aiassist.application.port.out;

import org.gregb884.aiassist.domain.model.AiPlan;

import java.io.IOException;

public interface TranslatorPort {


    AiPlan translateNameAndDescription(AiPlan aiPlan, String lang) throws IOException, InterruptedException;

}
