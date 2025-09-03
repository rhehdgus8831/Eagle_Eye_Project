package eagle.eye.dashboard.service;

import eagle.eye.dashboard.config.GameProperties;
import eagle.eye.dashboard.entity.Unit;
import eagle.eye.dashboard.repository.UnitRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling // 스케줄링 기능 활성화
@RequiredArgsConstructor
public class GameService {

    private final UnitRepository unitRepository;
    private final SimpMessagingTemplate messagingTemplate; // websocket
    private final GameProperties gameProperties;


    @Scheduled(fixedRate = 1000)
    @Transactional
    public void gameLoop() {
        final double BORDER_LATITUDE = gameProperties.getBorder().getLatitude();
        Unit invadingUnit = unitRepository.findById(2L).orElse(null);

        if (invadingUnit == null) {
            return; // 유닛이 없으면 아무것도 안 함
        }

        // 1. 위치는 계속해서 남쪽으로 이동
        invadingUnit.setLatitude(invadingUnit.getLatitude() - 0.005);

        // 2. 경계선을 넘었고, 아직 경보가 울린 적이 없다면(!isAlertTriggered) 경보를 울림
        if (invadingUnit.getLatitude() < BORDER_LATITUDE && !invadingUnit.isAlertTriggered()) {
            invadingUnit.setAlertTriggered(true);
            System.out.println("!!! 경고: " + invadingUnit.getName() + " 경계선 침범 !!!");
        }

        // 3. 변경된 정보(계속 바뀌는 위치 + 한 번 바뀐 경보 상태)를 저장하고 방송
        Unit updatedUnit = unitRepository.save(invadingUnit);
        messagingTemplate.convertAndSend("/topic/units", updatedUnit);
    }



}
