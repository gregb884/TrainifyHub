package org.gregb884.notification.infrastructure.config;

import org.gregb884.notification.application.dto.NotificationRequest;
import org.gregb884.notification.infrastructure.adapter.out.RabbitListenerNotification;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    @Bean
    public Queue notificationsQueue() {
        return new Queue("notificationsQueue", true);
    }


    @Bean
    public TopicExchange notificationsExchange() {
        return new TopicExchange("notificationsExchange");
    }


    @Bean
    public Binding bindingNotificationsQueueNewPlan(Queue notificationsQueue, TopicExchange notificationsExchange) {
        return BindingBuilder.bind(notificationsQueue).to(notificationsExchange).with("notifications.newPlan");
    }

    @Bean
    public Binding bindingNotificationsQueueNewMessage(Queue notificationsQueue, TopicExchange notificationsExchange) {
        return BindingBuilder.bind(notificationsQueue).to(notificationsExchange).with("notifications.newMessage");
    }

    @Bean
    public Binding bindingNotificationsQueueStats(Queue notificationsQueue, TopicExchange notificationsExchange) {
        return BindingBuilder.bind(notificationsQueue).to(notificationsExchange).with("notifications.statistic");
    }


    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();

        typeMapper.setTrustedPackages("org.gregb884.notification.model");
        typeMapper.setIdClassMapping(Map.of(
                "org.gregb884.notification.model.NotificationRequest", NotificationRequest.class
        ));

        converter.setJavaTypeMapper(typeMapper);
        return converter;
    }

    @Bean
    public SimpleMessageListenerContainer listenerContainer(ConnectionFactory connectionFactory,
                                                            MessageListenerAdapter listenerAdapter) {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.setQueues(notificationsQueue());
        container.setMessageListener(listenerAdapter);
        container.setAutoStartup(true);
        return container;
    }

    @Bean
    public MessageListenerAdapter listenerAdapter(RabbitListenerNotification notificationService) {
        MessageListenerAdapter adapter = new MessageListenerAdapter(notificationService, "consumeNotification");
        adapter.setMessageConverter(jsonMessageConverter());
        return adapter;
    }
}