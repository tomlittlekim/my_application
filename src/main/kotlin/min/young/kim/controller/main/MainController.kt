package min.young.kim.controller.main

import min.young.kim.resolver.movie.MovieDataFetcher
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping

@Controller
class MainController(
    private val movieDataFetcher: MovieDataFetcher
) {

    @GetMapping("/")
    fun index(model: Model): String {
        model.addAttribute("movies", movieDataFetcher.allMovies())
        return "index"
    }

}