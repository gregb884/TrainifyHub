package org.gregb884.aiassist.domain.service;

import org.gregb884.aiassist.domain.model.Request;

import java.util.List;

public class AiPromptBuilder {



    public String buildPrompt(Request request, List<String> primaryFocusExercises) {

        String satisfied = "";

        if (request.getLastPlanId() != 0) {
            if (request.isPreviousOk()) {
                satisfied = "The user was satisfied with the previous plan.";
            } else {
                satisfied = "The user was not satisfied with the previous plan.";
            }
        }

        String exercisesString = String.join(", ", primaryFocusExercises);

        if (exercisesString.isEmpty()) {
            exercisesString = "No specific exercise list is available, so feel free to use popular exercises instead.";
        }

        return  "You are a professional fitness coach. Please create a balanced, personalized training plan in JSON format based on the following user information:\n\n" +
                "**User Information:**\n" +
                "- **Goal**: " + request.getGoal() + "\n" +
                "- **Experience Level**: " + request.getExperience() + "\n" +
                "- **Training Days per Week**: " + daysCount(request.getDays()) + "\n" +
                "- **Session Duration**: " + request.getSessionTime() + " minutes\n" +
                "- **Excluded Equipment**: " + request.getEquipment() + "\n" +
                "- **Preferences**: " + request.getPreferences() + "\n" +
                "- **Previous Plan Satisfaction**: " + satisfied + "\n" +
                "- **Previous Plan Details**:\n" +
                request.getLastPlanDescription() + "\n" +
                "- **Do not schedule the same exercises as in the attached previous plan to ensure the plan feels fresh** \n"+
                "- **Primary Focus**: " + request.getPrimaryFocus() + "\n" +
                "- **Exercises for the primary focus only**: Please use exercises for " + request.getPrimaryFocus() + " from the following list: \n" +
                exercisesString + "\n" +
                "**Instructions:**\n" +
                "- Develop a training plan suitable for an " + request.getExperience() + " individual aiming for " + request.getGoal() + ".\n" +
                "- Schedule workouts for " + daysCount(request.getDays()) + " days per week, each lasting about " + request.getSessionTime() + " minutes.\n" +
                "- Include **6 to 8 exercises** per workout day, covering all major muscle groups to ensure balanced development.\n" +
                "- Use the provided list of exercises **only for the primary focus area (" + request.getPrimaryFocus() + ")** and add exercises for other muscle groups from your own knowledge base.\n" +
                "- Ensure exercises for " + request.getPrimaryFocus() + " meet the volume recommendations for the experience level: beginner (12 sets, 6 exercises), intermediate (15 sets, 7 exercises), advanced (20 sets, 8 exercises).\n" +
                "- Distribute the remaining volume across other major muscle groups (e.g., back, chest, arms, legs) using relevant exercises.\n" +
                "- Avoid including exercises that use " + request.getEquipment() + " or conflict with the user's preferences.\n" +
                "- Ensure the total weekly volume is appropriate for an " + request.getExperience() + " individual aiming for " + request.getGoal() + ".\n" +
                "- Provide detailed information for each workout day, including exercises, **plannedSeries** (number of sets), **repetitions**, and **rest periods**.\n" +
                "- Present the plan in JSON format ONLY, following this exact structure:\n" +
                "```json\n" +
                "{\n" +
                "  \"planName\": \"Plan Name in English\",\n" +
                "  \"description\": \"Brief description in English.\",\n" +
                "  \"days\": {\n" +
                "    \"day1\": {\n" +
                "      \"Barbell Squat\": { \"repetitions\": 8, \"plannedSeries\": 4, \"rest\": \"90 seconds\" },\n" +
                "      \"Lunges\": { \"repetitions\": 10, \"plannedSeries\": 3, \"rest\": \"60 seconds\" },\n" +
                "      ...\n" +
                "    },\n" +
                "    \"day2\": {\n" +
                "      \"Bench Press\": { \"repetitions\": 8, \"plannedSeries\": 4, \"rest\": \"90 seconds\" },\n" +
                "      \"Incline Dumbbell Press\": { \"repetitions\": 10, \"plannedSeries\": 3, \"rest\": \"60 seconds\" },\n" +
                "      ...\n" +
                "    },\n" +
                "    ...\n" +
                "  },\n" +
                "  \"additionalNotes\": \"Any additional notes in English.\"\n" +
                "}\n" +
                "```\n" +
                "- **Ensure the plan is balanced and does not focus exclusively on " + request.getPrimaryFocus() + ".**\n" +
                "- **Ensure the JSON is properly formatted and parsable. Do not include any text outside of the JSON structure.**";

    }


    public String extractJson(String response) throws Exception {
        int start = response.indexOf("{");
        int end = response.lastIndexOf("}");
        if (start != -1 && end != -1) {
            return response.substring(start, end + 1);
        }
        throw new Exception("Response does not contain valid JSON: " + response);
    }

    public int daysCount(String days) {
        if (days == null || days.trim().isEmpty()) return 0;
        String[] numbers = days.split(",");
        return numbers.length;
    }
}
