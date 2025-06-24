package org.gregb884.aiassist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AiAssistApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiAssistApplication.class, args);
    }

}
