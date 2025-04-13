package org.gregb884.aiassist.repository;

import org.gregb884.aiassist.model.AiExercise;
import org.gregb884.aiassist.model.OptionalExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OptionalExerciseRepository extends JpaRepository<OptionalExercise, Integer> {


}
