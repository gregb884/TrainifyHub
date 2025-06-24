package org.gregb884.statistic.domain.service;


import org.gregb884.statistic.domain.dto.ExerciseStatsDtoDetails;
import org.gregb884.statistic.domain.mapper.ExerciseStatsMapper;
import org.gregb884.statistic.domain.model.ExerciseStats;
import org.gregb884.statistic.domain.model.ProgressType;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class ExerciseStatsService {


    public List<ExerciseStatsDtoDetails> getAggregatesStatsList(List<ExerciseStats> exerciseStatsList){

        int totalRecords = exerciseStatsList.size();

        if (totalRecords <= 100) {
            return exerciseStatsList.stream()
                    .map(ExerciseStatsMapper::toDetailsDto)
                    .collect(Collectors.toList());
        }


        int targetSize = 100;
        int groupSize = (int) Math.ceil((double) totalRecords / targetSize);

        List<ExerciseStatsDtoDetails> aggregatedList = new ArrayList<>();

        for (int i = 0; i < targetSize; i++) {
            int startIdx = i * groupSize;
            int endIdx = Math.min(startIdx + groupSize, totalRecords);

            List<ExerciseStats> group = exerciseStatsList.subList(startIdx, endIdx);

            int avgReps = (int) group.stream().mapToInt(ExerciseStats::getReps).average().orElse(0);
            double avgWeight = group.stream().mapToDouble(ExerciseStats::getWeight).average().orElse(0);
            double avgOneRepMax = group.stream().mapToDouble(ExerciseStats::getOneRepMax).average().orElse(0);
            Date date = group.get(group.size() - 1).getAddDate();

            ExerciseStatsDtoDetails aggregatedDto = new ExerciseStatsDtoDetails(avgReps, avgWeight, avgOneRepMax, date);

            aggregatedList.add(aggregatedDto);

            if (endIdx >= totalRecords) {
                break;
            }
        }

        return aggregatedList;

    }


    public ProgressType detectProgressOrRegress(List<ExerciseStats> todayStats, List<ExerciseStats> previousStats) {
        if (todayStats.size() != previousStats.size()) return ProgressType.NONE;

        double todayAvg = todayStats.stream().mapToDouble(ExerciseStats::getOneRepMax).average().orElse(0);
        double previousAvg = previousStats.stream().mapToDouble(ExerciseStats::getOneRepMax).average().orElse(0);

        if (todayAvg > previousAvg) return ProgressType.PROGRESS;
        else if (todayAvg < previousAvg) return ProgressType.REGRESS;
        else return ProgressType.NONE;
    }



    public ProgressType detectSingleProgress(double current, double previous) {
        if (current > previous) return ProgressType.PROGRESS;
        else if (current < previous) return ProgressType.REGRESS;
        else return ProgressType.NONE;
    }




}
