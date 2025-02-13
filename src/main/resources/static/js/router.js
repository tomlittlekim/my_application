import { renderAllMovies, renderMovieDetails, renderAddMovieForm } from './movie-fetch-rendering.js';

export function router() {
  const hash = window.location.hash;

  if (hash === '' || hash === '#/') {
    loadPage('/fragments/all-movies.html', renderAllMovies);
  } else if (hash.startsWith('#/movie/')) {
    const movieId = hash.split('/')[2];
    loadPage('/fragments/movie-details.html', (template) => renderMovieDetails(movieId, template));
  } else if (hash === '#/add') {
    loadPage('/fragments/add-movie.html', renderAddMovieForm);
  }
}

async function loadPage(url, callback) {
  try {
    const response = await fetch(url);
    const template = await response.text();
    const app = document.getElementById('app');
    app.innerHTML = template;

    if (callback) callback(template);
  } catch (error) {
    console.error(`Failed to load page: ${error}`);
  }
}