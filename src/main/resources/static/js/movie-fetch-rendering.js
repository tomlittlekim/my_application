import { fetchMovies, fetchMovieDetails } from './movie-fetch.js';

export async function renderAllMovies(template) {
  const movies = await fetchMovies();
  // 반복해서 쓸 `<li>...</li>` 전용의 간단한 소규모 템플릿
  const liTemplate = `
    <li class="list-group-item">
      <a href="#/movie/{{id}}">{{title}}</a> ({{releaseYear}})
    </li>
  `;

  // movies를 순회하면서 문자열 치환 -> #movieList 안에 추가
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = ''; // 혹시 남아있을지 모를 잔여물 초기화

  movies.forEach((movie) => {
    const itemHtml = liTemplate
    .replace('{{id}}', movie.id)
    .replace('{{title}}', movie.title)
    .replace('{{releaseYear}}', movie.releaseYear);

    movieList.innerHTML += itemHtml;
  });
}

export async function renderMovieDetails(movieId, template) {
  const movie = await fetchMovieDetails(movieId);

  const htmlForDetails = `
    <h5>ID: ${movie.id}</h5>
    <p class="mb-2">Title: ${movie.title}</p>
    <p class="mb-0">Release Year: ${movie.releaseYear}</p>
  `;

  document.getElementById('movieDetails').innerHTML = htmlForDetails;
}