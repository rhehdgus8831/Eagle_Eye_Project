package eagle.eye.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 20)
    private String faction; // "friend" or "enemy"

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    private boolean alertTriggered=false;

}


/*
CREATE TABLE unit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    faction VARCHAR(20) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    alert_triggered BOOLEAN DEFAULT FALSE
);


-- 데이터 삽입
INSERT INTO unit (name, faction, latitude, longitude, alert_triggered) VALUES
('사령부', 'HQ', 37.5665, 126.9780, false), -- 서울 시청 위치 (아군 본부)
('침투조', 'ENEMY', 38.2, 127.1, false), -- 경계선 북쪽 (이 유닛이 남하할 주인공)
('알파팀', 'FRIEND', 37.9, 127.0, false), -- 경계선 남쪽 아군 1
('브라보팀', 'FRIEND', 37.85, 127.2, false), -- 경계선 남쪽 아군 2
('적 정찰조', 'ENEMY', 38.3, 127.2, false); -- 경계선 북쪽 다른 적군
*/


