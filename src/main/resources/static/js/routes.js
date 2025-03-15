import {
  renderAddMovieForm,
  renderAllMovies,
  renderEditMovieForm,
  renderMovieDetails,
  setupEventHandlers
} from './movie/movie-render.js';
import {renderUserProfile} from './auth/profile-render.js';

export const routes = [
  // 영화 Section
  {
    path: /^(?:#?\/?)$/,
    fragment: '/fragments/movie/all-movies.html',
    callback: (template) => {
      renderAllMovies(template);
      // 모든 이벤트 핸들러 설정 (토글 버튼 + 검색 관련 이벤트)
      setupEventHandlers();
    },
  },
  {
    path: /^#\/movie\/(.*)$/, // '#/movie/:id'
    fragment: '/fragments/movie/movie-details.html',
    callback: (template, params) => {
      const movieId = params[1];
      renderMovieDetails(movieId, template);
    },
  },
  {
    path: /^#\/add$/,
    fragment: '/fragments/movie/add-movie.html',
    callback: renderAddMovieForm,
  },
  {
    path: /^#\/edit\/(.+)$/, // '#/edit/:id'
    fragment: '/fragments/movie/edit-movie.html',
    callback: (template, params) => {
      const movieId = params[1];
      renderEditMovieForm(movieId);
    },
  },
  // 영화 Section End

  // 사용자 Section
  {
    path: /^#\/profile$/,
    fragment: '/fragments/auth/user-profile.html',
    callback: renderUserProfile,
  },
  // 사용자 Section End

  // 관리자 Section
  {
    path: /^#\/admin$/,
    fragment: '/fragments/admin/admin-dashboard.html',
    callback: (template) => {
      // 관리자 대시보드 렌더링 로직
      // 여기서 관리자 권한 확인 로직 추가 필요
    },
  },
  // 관리자 Section End
]