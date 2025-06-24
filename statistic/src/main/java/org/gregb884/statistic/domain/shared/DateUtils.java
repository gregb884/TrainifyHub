package org.gregb884.statistic.domain.shared;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class DateUtils {

    public static Date startOfDay(Date date) {
        LocalDateTime ldt = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().atStartOfDay();
        return Date.from(ldt.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date endOfDay(Date date) {
        LocalDateTime ldt = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().atTime(23, 59, 59);
        return Date.from(ldt.atZone(ZoneId.systemDefault()).toInstant());
    }
}
