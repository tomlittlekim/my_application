import {
  addMovie,
  fetchMovieDetails,
  fetchMovies,
  updateMovie
} from './movie-fetch.js';
import {fetchCodes} from "../common/common-fetch.js";

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

  // Edit Movie 버튼의 href를 영화 ID를 포함하여 업데이트
  const editButton = document.querySelector('a[href^="#/edit"]');
  if (editButton) editButton.href = `#/edit/${movie.id}`;
}

export function renderAddMovieForm() {
  const form = document.getElementById('addMovieForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.title.value.trim();
    const releaseYear = form.releaseYear.value.trim();

    try {
      await addMovie(title, releaseYear);
      alert('Added Movie!');
      window.location.hash = '#/';
    } catch (error) {
      console.error(`Failed to add movie: ${error}`);
      alert('Failed to add movie. Please try again');
    }
  });
}

export async function renderEditMovieForm(id) {
  // 영화 세부정보를 먼저 불러오기
  const movie = await fetchMovieDetails(id);
  document.getElementById('displayMovieId').textContent = movie.id;
  document.getElementById('movieId').value = movie.id;
  document.getElementById('title').value = movie.title;
  document.getElementById('releaseYear').value = movie.releaseYear;

  const codes = await fetchCodes("IS_USABLE");
  const select = document.getElementById('isUsable');
  select.innerHTML = '';
  codes.forEach((code) => {
    const option = document.createElement('option');
    option.value = code.id.code;
    option.textContent = code.displayValue;
    select.appendChild(option);
  });
  // movie.isUsable은 Boolean이므로, true -> 'Y', false -> 'N'
  select.value = movie.isUsable ? 'Y' : 'N';

  // 수정 폼 제출 이벤트 처리
  const form = document.getElementById('editMovieForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = form.movieId.value.trim();
    const title = form.title.value.trim();
    const releaseYear = form.releaseYear.value.trim();
    const isUsableCode = form.isUsable.value; // 'Y' 또는 'N'
    const isUsable = isUsableCode === 'Y'; // Boolean으로 변환

    try {
      await updateMovie(id, title, parseInt(releaseYear, 10), isUsable);
      alert('Movie updated successfully!');
      window.location.hash = `#/movie/${id}`;
    } catch (error) {
      console.error(`Failed to update movie: ${error}`);
      alert('Failed to update movie. Please try again');
    }
  });
}