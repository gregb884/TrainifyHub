package org.gregb884.profilemanager.infrastructure.i18n;


import lombok.RequiredArgsConstructor;
import org.gregb884.profilemanager.application.port.out.LocalizationPort;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class LocalizationService implements LocalizationPort {


    private final MessageSource messageSource;

    @Override
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
