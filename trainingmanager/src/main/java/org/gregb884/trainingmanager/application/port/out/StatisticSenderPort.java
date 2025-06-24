package org.gregb884.trainingmanager.application.port.out;

import org.gregb884.trainingmanager.application.dto.ExerciseSeriesDto;

public interface StatisticSenderPort {


    String sendSeriesToStatisticModule(ExerciseSeriesDto exerciseSeriesDto, long exerciseId);


}
