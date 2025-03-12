import {
  renderAddMovieForm,
  renderAllMovies,
  renderEditMovieForm,
  renderMovieDetails
} from './movie/movie-render.js';

export const routes = [
  // 영화 Section
  {
    path: /^(?:#?\/?)$/,
    fragment: '/fragments/all-movies.html',
    callback: renderAllMovies,
  },
  {
    path: /^#\/movie\/(.*)$/, // '#/movie/:id'
    fragment: '/fragments/movie-details.html',
    callback: (template, params) => {
      const movieId = params[1];
      renderMovieDetails(movieId, template);
    },
  },
  {
    path: /^#\/add$/,
    fragment: '/fragments/add-movie.html',
    callback: renderAddMovieForm,
  },
  {
    path: /^#\/edit\/(.+)$/, // '#/edit/:id'
    fragment: '/fragments/edit-movie.html',
    callback: (template, params) => {
      const movieId = params[1];
      renderEditMovieForm(movieId);
    },
  },
  // 영화 Section End
]