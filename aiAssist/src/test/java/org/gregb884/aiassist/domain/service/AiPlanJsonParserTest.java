package org.gregb884.aiassist.domain.service;

import org.gregb884.aiassist.domain.model.AiDay;
import org.gregb884.aiassist.domain.model.AiExercise;
import org.gregb884.aiassist.domain.model.AiPlan;
import org.gregb884.aiassist.domain.model.OptionalExercise;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AiPlanJsonParserTest {


    private final AiPlanJsonParser parser = new AiPlanJsonParser();

    @Test
    void shouldParseValidJsonAndReturnAiPlan() throws Exception {
        // language=JSON
        String json = """
            {
              "planName": "Test Plan",
              "description": "Test Description",
              "additionalNotes": "Test Notes",
              "days": {
                "day1": {
                  "Push-Up": {
                    "repetitions": 10,
                    "plannedSeries": 3,
                    "rest": "90s"
                  }
                }
              }
            }
            """;

        OptionalExercise opt = new OptionalExercise();
        opt.setId(1L);
        opt.setSelected(true);

        Map<String, List<OptionalExercise>> optionalMap = Map.of(
                "Push-Up", List.of(opt)
        );

        AiPlan aiPlan = parser.parsePlanFromJsonAndSave(json, 123L, optionalMap);

        // Assertions
        assertEquals("Test Plan", aiPlan.getPlanName());
        assertEquals("Test Description", aiPlan.getDescription());
        assertEquals("Test Notes", aiPlan.getAdditionalNotes());
        assertEquals(123L, aiPlan.getUserId());

        List<AiDay> aiDays = aiPlan.getAiDays();
        assertEquals(1, aiDays.size());
        assertEquals("day1", aiDays.get(0).getDayName());

        List<AiExercise> exercises = aiDays.get(0).getAiExercises();
        assertEquals(1, exercises.size());
        AiExercise ex = exercises.get(0);

        assertEquals("Push-Up", ex.getExerciseName());
        assertEquals(10, ex.getRepetitions());
        assertEquals(3, ex.getPlannedSeries());
        assertEquals(90, ex.getRest());

        assertEquals(1, ex.getOptionalExerciseList().size());
        assertSame(ex, ex.getOptionalExerciseList().get(0).getAiExercise());
    }

    @Test
    void shouldDefaultRestAndRepsIfMissing() throws Exception {
        // language=JSON
        String json = """
            {
              "planName": "X",
              "description": "Y",
              "additionalNotes": "Z",
              "days": {
                "day1": {
                  "Burpee": {
                    "repetitions": 0,
                    "plannedSeries": 3,
                    "rest": ""
                  }
                }
              }
            }
            """;

        AiPlan plan = parser.parsePlanFromJsonAndSave(json, 1L, Map.of());

        AiExercise ex = plan.getAiDays().get(0).getAiExercises().get(0);
        assertEquals(15, ex.getRepetitions()); // default
        assertEquals(90, ex.getRest());        // default
    }


    @Test
    void cleanJsonString_shouldRemoveMarkdown() {
        String raw = "```json\n{\"foo\": \"bar\"}\n```";
        String cleaned = parser.cleanJsonString(raw);
        assertEquals("{\"foo\": \"bar\"}", cleaned);
    }

}