package org.gregb884.auth.domain.service;

import org.gregb884.auth.infrastructure.service.LocalizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.MessageSource;

import java.util.Locale;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class LocalizationServiceTest {

    private MessageSource messageSource;
    private LocalizationService localizationService;

    @BeforeEach
    void setUp() {
        messageSource = mock(MessageSource.class);
        localizationService = new LocalizationService(messageSource);
    }

    @Test
    void shouldReturnEnglishMessageWhenLanguageIsEmpty() {
        String key = "greeting";
        String expectedMessage = "Hello";

        when(messageSource.getMessage(eq(key), eq(null), eq(Locale.ENGLISH)))
                .thenReturn(expectedMessage);

        String result = localizationService.getLocalizedMessage(key, "");

        assertThat(result).isEqualTo(expectedMessage);
    }

    @Test
    void shouldReturnLocalizedMessageForProvidedLanguage() {
        String key = "greeting";
        String expectedMessage = "Witaj";
        String language = "pl";

        when(messageSource.getMessage(eq(key), eq(null), eq(new Locale(language))))
                .thenReturn(expectedMessage);

        String result = localizationService.getLocalizedMessage(key, language);

        assertThat(result).isEqualTo(expectedMessage);
    }
}