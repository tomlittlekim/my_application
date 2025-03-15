package min.young.kim.service.user

import min.young.kim.model.user.User
import min.young.kim.model.user.UserRole
import min.young.kim.repository.user.UserRepository
import min.young.kim.security.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenProvider: JwtTokenProvider
) {

    /**
     * 로그인 처리
     */
    fun login(username: String, password: String): AuthResult {
        return try {
            // Spring Security 인증 처리
            val authentication: Authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(username, password)
            )

            // 인증 성공: SecurityContext에 인증 객체 설정
            SecurityContextHolder.getContext().authentication = authentication

            // 사용자 정보 조회
            val user = userRepository.findByUsername(username).orElseThrow()

            // 마지막 로그인 시간 업데이트
            user.updateLastLoginTime()
            userRepository.save(user)

            // JWT 토큰 생성
            val token = jwtTokenProvider.generateToken(user)

            // 로그인 성공 결과 반환
            AuthResult(
                success = true,
                token = token,
                user = user,
                message = "로그인 성공"
            )
        } catch (e: BadCredentialsException) {
            // 인증 실패
            AuthResult(
                success = false,
                token = null,
                user = null,
                message = "아이디 또는 비밀번호가 일치하지 않습니다."
            )
        } catch (e: Exception) {
            // 기타 오류
            AuthResult(
                success = false,
                token = null,
                user = null,
                message = "로그인 처리 중 오류가 발생했습니다: ${e.message}"
            )
        }
    }

    /**
     * 회원가입 처리
     */
    @Transactional
    fun register(username: String, email: String, password: String): RegisterResult {
        // 사용자명 중복 확인
        if (userRepository.existsByUsername(username)) {
            return RegisterResult(
                success = false,
                user = null,
                message = "이미 사용 중인 아이디입니다."
            )
        }

        // 이메일 중복 확인
        if (userRepository.existsByEmail(email)) {
            return RegisterResult(
                success = false,
                user = null,
                message = "이미 사용 중인 이메일입니다."
            )
        }

        try {
            // 새 사용자 생성
            val user = User(
                username = username,
                email = email,
                password = passwordEncoder.encode(password),
                role = UserRole.USER
            )

            // 사용자 저장
            val savedUser = userRepository.save(user)

            return RegisterResult(
                success = true,
                user = savedUser,
                message = "회원가입이 완료되었습니다."
            )
        } catch (e: Exception) {
            return RegisterResult(
                success = false,
                user = null,
                message = "회원가입 처리 중 오류가 발생했습니다: ${e.message}"
            )
        }
    }

    /**
     * 현재 로그인한 사용자 정보 조회
     */
    fun getCurrentUser(authentication: Authentication?): User? {
        if (authentication == null || !authentication.isAuthenticated) {
            return null
        }

        val username = authentication.name
        return userRepository.findByUsername(username).orElse(null)
    }

    /**
     * 모든 사용자 조회 (관리자 전용)
     */
    fun getAllUsers(): List<User> {
        return userRepository.findAll()
    }

    /**
     * 비밀번호 변경
     */
    @Transactional
    fun changePassword(userId: String, oldPassword: String, newPassword: String): ChangePasswordResult {
        val user = userRepository.findById(userId).orElse(null)
            ?: return ChangePasswordResult(success = false, message = "사용자를 찾을 수 없습니다.")

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(oldPassword, user.password)) {
            return ChangePasswordResult(success = false, message = "현재 비밀번호가 일치하지 않습니다.")
        }

        // 새 비밀번호로 업데이트
        user.password = passwordEncoder.encode(newPassword)
        userRepository.save(user)

        return ChangePasswordResult(success = true, message = "비밀번호가 성공적으로 변경되었습니다.")
    }

    /**
     * 사용자 정보 업데이트
     */
    @Transactional
    fun updateUser(userId: String, email: String?): UserUpdateResult {
        val user = userRepository.findById(userId).orElse(null)
            ?: return UserUpdateResult(success = false, message = "사용자를 찾을 수 없습니다.", user = null)

        // 이메일 변경
        if (!email.isNullOrBlank() && email != user.email) {
            // 이메일 중복 확인
            if (userRepository.existsByEmail(email)) {
                return UserUpdateResult(success = false, message = "이미 사용 중인 이메일입니다.", user = null)
            }

            user.email = email
        }

        val updatedUser = userRepository.save(user)

        return UserUpdateResult(
            success = true,
            message = "사용자 정보가 업데이트되었습니다.",
            user = updatedUser
        )
    }
}

/**
 * 로그인 결과 데이터 클래스
 */
data class AuthResult(
    val success: Boolean,
    val token: String?,
    val user: User?,
    val message: String?
)

/**
 * 회원가입 결과 데이터 클래스
 */
data class RegisterResult(
    val success: Boolean,
    val user: User?,
    val message: String
)

/**
 * 비밀번호 변경 결과 데이터 클래스
 */
data class ChangePasswordResult(
    val success: Boolean,
    val message: String
)

/**
 * 사용자 정보 업데이트 결과 데이터 클래스
 */
data class UserUpdateResult(
    val success: Boolean,
    val message: String,
    val user: User?
)