package min.young.kim.repository.user

import min.young.kim.model.user.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, String> {
    /**
     * 사용자명으로 사용자 조회
     */
    fun findByUsername(username: String): Optional<User>

    /**
     * 이메일로 사용자 조회
     */
    fun findByEmail(email: String): Optional<User>

    /**
     * 사용자명 존재 여부 확인
     */
    fun existsByUsername(username: String): Boolean

    /**
     * 이메일 존재 여부 확인
     */
    fun existsByEmail(email: String): Boolean
}