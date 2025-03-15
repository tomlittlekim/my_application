package min.young.kim.security

import min.young.kim.repository.user.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            .orElseThrow { UsernameNotFoundException("사용자를 찾을 수 없습니다: $username") }

        // Spring Security의 User 객체 생성
        return User(
            user.username,
            user.password,
            listOf(SimpleGrantedAuthority("ROLE_${user.role.name}"))
        )
    }

    /**
     * 사용자 ID로 사용자 상세 정보 로드
     */
    fun loadUserById(id: String): UserDetails {
        val user = userRepository.findById(id)
            .orElseThrow { UsernameNotFoundException("사용자 ID를 찾을 수 없습니다: $id") }

        return User(
            user.username,
            user.password,
            listOf(SimpleGrantedAuthority("ROLE_${user.role.name}"))
        )
    }
}