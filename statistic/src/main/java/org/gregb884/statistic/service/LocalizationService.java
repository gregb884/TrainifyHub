package org.gregb884.statistic.service;


import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class LocalizationService {


    private final MessageSource messageSource;


    public LocalizationService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }


    public String getLocalizedMessage(String key,String language) {



        if (language.isEmpty()) {

            Locale locale = new Locale("en");
            return messageSource.getMessage(key, null, locale);

        } else {

            Locale locale = new Locale(language);

            return messageSource.getMessage(key, null, locale);

        }

    }


}
