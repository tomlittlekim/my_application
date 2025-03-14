import {
  renderAddMovieForm,
  renderAllMovies,
  renderEditMovieForm,
  renderMovieDetails,
  setupEventHandlers
} from './movie/movie-render.js';

export const routes = [
  // 영화 Section
  {
    path: /^(?:#?\/?)$/,
    fragment: '/fragments/all-movies.html',
    callback: (template) => {
      renderAllMovies(template);
      // 모든 이벤트 핸들러 설정 (토글 버튼 + 검색 관련 이벤트)
      setupEventHandlers();
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