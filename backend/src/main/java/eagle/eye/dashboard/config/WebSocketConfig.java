package eagle.eye.dashboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // (1) WebSocket 메시지 브로커 기능 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // (2) 메시지 브로커 설정: "/topic"으로 시작하는 주소로 메시지를 구독/발행
        registry.enableSimpleBroker("/topic");
        // 메시지를 발행할 때 사용할 주소의 접두사 (사용하지 않으면 생략 가능)
        // registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // (3) 클라이언트가 접속할 창구(Endpoint) 설정
        // "/ws"라는 주소로 WebSocket 연결을 허용하고, SockJS를 사용해 호환성을 높임
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // 모든 출처에서의 접속을 허용 (CORS 설정)
                .withSockJS();
    }
}