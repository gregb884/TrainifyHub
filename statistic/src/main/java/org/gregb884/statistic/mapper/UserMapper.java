package org.gregb884.statistic.mapper;

import org.gregb884.statistic.dto.UserDtoHighlights;
import org.gregb884.statistic.model.User;

public class UserMapper {


        public static UserDtoHighlights toDtoHighlights(User user) {


            UserDtoHighlights dto = new UserDtoHighlights();

            dto.setRmProgress(user.getRmProgress());
            dto.setRegress(user.getRegress());
            dto.setExerciseNew(user.getExerciseNew());
            dto.setProgress(user.getProgress());

            return dto;
        }



    }
