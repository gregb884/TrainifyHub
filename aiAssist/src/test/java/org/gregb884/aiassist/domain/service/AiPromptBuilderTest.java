package org.gregb884.aiassist.domain.service;

import org.gregb884.aiassist.domain.model.Request;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AiPromptBuilderTest {

    private final AiPromptBuilder builder = new AiPromptBuilder();

    @Test
    void shouldBuildPromptWithCorrectStructure() {
        Request request = new Request();
        request.setGoal("Fat loss");
        request.setExperience("Intermediate");
        request.setDays("1,2,3");
        request.setSessionTime(45);
        request.setEquipment("None");
        request.setPreferences("No lunges");
        request.setPreviousOk(true);
        request.setLastPlanId(123);
        request.setLastPlanDescription("Last plan had too much cardio.");
        request.setPrimaryFocus("Chest");

        List<String> exercises = List.of("Push-Up", "Incline Press");

        String prompt = builder.buildPrompt(request, exercises);


        assertAll(
                () -> assertTrue(prompt.contains("Fat loss")),
                () -> assertTrue(prompt.contains("Intermediate")),
                () -> assertTrue(prompt.contains("Push-Up")),
                () -> assertTrue(prompt.contains("Incline Press")),
                () -> assertTrue(prompt.contains("\"planName\"")),
                () -> assertTrue(prompt.toLowerCase().contains("json"))
        );
    }

    @Test
    void shouldBuildPromptWithFallbackExerciseText() {
        Request request = new Request();
        request.setGoal("Muscle gain");
        request.setExperience("Beginner");
        request.setDays("1,2");
        request.setSessionTime(30);
        request.setEquipment("Bands");
        request.setPreferences("None");
        request.setPrimaryFocus("Legs");
        request.setLastPlanId(0);

        String prompt = builder.buildPrompt(request, List.of());

        assertTrue(prompt.contains("No specific exercise list is available"));
    }

    @Test
    void shouldExtractValidJsonFromWrappedString() throws Exception {
        String input = """
            Here is your plan:
            ```json
            {
              "planName": "My Plan",
              "description": "desc"
            }
            ```
            """;

        String json = builder.extractJson(input);
        assertTrue(json.startsWith("{"));
        assertTrue(json.endsWith("}"));
    }

    @Test
    void shouldThrowExceptionIfNoJsonFound() {
        String badInput = "No JSON here";

        Exception ex = assertThrows(Exception.class, () -> builder.extractJson(badInput));
        assertTrue(ex.getMessage().contains("Response does not contain valid JSON"));
    }

    @Test
    void shouldCountDaysCorrectly() {
        assertEquals(3, builder.daysCount("1,2,3"));
        assertEquals(1, builder.daysCount("7"));
        assertEquals(0, builder.daysCount(""));
    }
}