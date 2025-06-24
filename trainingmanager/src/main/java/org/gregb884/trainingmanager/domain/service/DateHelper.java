package org.gregb884.trainingmanager.domain.service;

import org.gregb884.trainingmanager.application.dto.WeekDto;
import org.gregb884.trainingmanager.domain.model.ExercisePlan;
import org.gregb884.trainingmanager.domain.model.ExerciseSeries;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.time.temporal.WeekFields;
import java.util.*;

public class DateHelper {


    public Integer weekNumber(Date date){

        LocalDate localDate = date.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
        return localDate.get(WeekFields.of(Locale.getDefault()).weekOfYear());
    }


    public static Date calculateEndDate(Date startDate) {

        LocalDate localStartDate = startDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        LocalDate localEndDate = localStartDate.plusDays(6);

        return Date.from(localEndDate.atStartOfDay(ZoneOffset.UTC).toInstant());
    }


    public static Date calculateDayDate(Date startDate, int day) {

        LocalDate localStartDate = startDate.toInstant().atZone(ZoneOffset.UTC).toLocalDate();

        LocalDate localPlannedDate = localStartDate.plusDays(day);

        return Date.from(localPlannedDate.atStartOfDay(ZoneOffset.UTC).toInstant());
    }


    public static String dayNameFromDate(Date date) {

        LocalDateTime localDateTime = date.toInstant()
                .atZone(ZoneOffset.UTC)
                .toLocalDateTime();


        return  localDateTime.getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

    }


    public static Date truncateTime(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }







}
