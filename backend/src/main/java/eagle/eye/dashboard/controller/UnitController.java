package eagle.eye.dashboard.controller;

import eagle.eye.dashboard.entity.Unit;
import eagle.eye.dashboard.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UnitController {

    private final UnitRepository unitRepository; // DB 조회를 위해 Repository 주입

    // (3) HTTP GET 요청이 '/api/units' 주소로 올 경우 이 메소드를 실행
    @GetMapping("/api/units")
    public List<Unit> getAllUnits() {
        // 모든 유닛 정보를 DB에서 조회하여 그대로 반환
        return unitRepository.findAll();
    }
}