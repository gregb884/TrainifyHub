package org.gregb884.aiassist.application.port.out;

import org.gregb884.aiassist.domain.model.OptionalExercise;

import java.util.List;
import java.util.Map;

public interface OptionalExerciseFetcherPort {

    Map<String, List<OptionalExercise>> getForExercises(List<String> names);


}