package min.young.kim.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.util.matcher.AntPathRequestMatcher

@Configuration
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { csrf ->
                csrf.ignoringRequestMatchers(AntPathRequestMatcher("/graphql"))
            }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/","js/**").permitAll()
                    .anyRequest().authenticated()
            }
            .httpBasic(Customizer.withDefaults())

        return http.build()
    }
}
