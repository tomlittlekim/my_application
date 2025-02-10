package min.young.kim.controller.movie

import min.young.kim.resolver.movie.MovieDataFetcher
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable

@Controller
class MovieController(
    private val movieDataFetcher: MovieDataFetcher
) {

    @GetMapping("/movie/{id}")
    fun movieDetails(@PathVariable id: String, model: Model): String {
        val movie = movieDataFetcher.movie(id)
        if (movie != null) {
            model.addAttribute("movie", movie)
        } else {
            model.addAttribute("error", "Movie not found")
        }

        return "movie-details"
    }

}