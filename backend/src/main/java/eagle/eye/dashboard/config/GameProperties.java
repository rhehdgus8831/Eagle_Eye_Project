
package eagle.eye.dashboard.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "game") // yml에서 "game"으로 시작하는 설정을 가져옴
public class GameProperties {

    private final Border border = new Border();

    @Getter
    @Setter
    public static class Border {
        private double latitude;
    }
}