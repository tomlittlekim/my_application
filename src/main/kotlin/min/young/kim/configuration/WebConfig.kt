package min.young.kim.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * 웹 MVC 설정 클래스
 * - 정적 리소스 매핑
 * - 뷰 컨트롤러 설정
 */
@Configuration
class WebConfig : WebMvcConfigurer {

    /**
     * 정적 리소스 핸들러 설정
     */
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        // 정적 리소스 매핑 (이미 기본 설정이 되어 있지만, 명시적으로 추가)
        registry.addResourceHandler("/js/**")
            .addResourceLocations("classpath:/static/js/")

        registry.addResourceHandler("/css/**")
            .addResourceLocations("classpath:/static/css/")

        registry.addResourceHandler("/fragments/**")
            .addResourceLocations("classpath:/static/fragments/")
    }

    /**
     * 뷰 컨트롤러 설정
     * - 특정 URL 요청을 지정된 뷰 이름으로 매핑
     */
    override fun addViewControllers(registry: ViewControllerRegistry) {
        // 로그인 페이지
        registry.addViewController("/login").setViewName("redirect:/fragments/auth/login.html")
        registry.addViewController("/login.html").setViewName("redirect:/fragments/auth/login.html")

        // 회원가입 페이지
        registry.addViewController("/register").setViewName("redirect:/fragments/auth/register.html")
        registry.addViewController("/register.html").setViewName("redirect:/fragments/auth/register.html")

        // 루트 경로는 정적 HTML 파일로 리다이렉트
        registry.addViewController("/").setViewName("redirect:/index.html")
    }
}