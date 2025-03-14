import {
  renderAddMovieForm,
  renderAllMovies,
  renderEditMovieForm,
  renderMovieDetails,
  setupToggleButton
} from './movie/movie-render.js';

export const routes = [
  // 영화 Section
  {
    path: /^(?:#?\/?)$/,
    fragment: '/fragments/all-movies.html',
    callback: (template) => {
      renderAllMovies(template);
      // 영화 목록 페이지에서 토글 버튼 설정
      setupToggleButton();
    },
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