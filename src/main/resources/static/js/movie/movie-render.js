import {
  addMovie,
  fetchMovieDetails,
  fetchMovies,
  updateMovie,
  deleteMovie,
} from './movie-fetch.js';
import {fetchCodes} from "../common/common-fetch.js";

// 상태 변수 추가: 숨겨진 영화 표시 여부
let showHiddenMovies = false;
// 검색 키워드 상태 저장
let currentSearchKeyword = '';
// 개봉년도 기간 검색 상태 저장
let currentStartYear = '';
let currentEndYear = '';

export async function renderAllMovies(template) {
  // 통합된 fetchMovies 함수 호출
  const movies = await fetchMovies(showHiddenMovies, currentSearchKeyword, currentStartYear, currentEndYear);

  // 반복해서 쓸 `<li>...</li>` 전용의 간단한 소규모 템플릿
  const liTemplate = `
    <li class="list-group-item{{hiddenClass}}">
      <a href="#/movie/{{id}}" {{hiddenStyle}}>{{title}}</a> ({{releaseYear}}){{hiddenText}}
    </li>
  `;

  // movies를 순회하면서 문자열 치환 -> #movieList 안에 추가
  const movieList = document.getElementById('movieList');
  movieList.innerHTML = ''; // 혹시 남아있을지 모를 잔여물 초기화

  // 검색 결과 정보 표시 업데이트
  const searchResultInfo = document.getElementById('searchResultInfo');

  // 검색 조건이 있는 경우 표시
  if (currentSearchKeyword || currentStartYear || currentEndYear) {
    searchResultInfo.classList.remove('d-none');

    // 표시할 검색 조건 정보 설정
    let searchInfoText = [];
    if (currentSearchKeyword) {
      searchInfoText.push(`제목: "${currentSearchKeyword}"`);
    }

    // 개봉년도 기간 정보 표시
    if (currentStartYear || currentEndYear) {
      let yearRangeText = '개봉년도: ';

      if (currentStartYear && currentEndYear) {
        yearRangeText += `${currentStartYear}년 ~ ${currentEndYear}년`;
      } else if (currentStartYear) {
        yearRangeText += `${currentStartYear}년 이후`;
      } else if (currentEndYear) {
        yearRangeText += `${currentEndYear}년 이전`;
      }

      searchInfoText.push(yearRangeText);
    }

    document.getElementById('searchCriteria').textContent = searchInfoText.join(', ');
  } else {
    searchResultInfo.classList.add('d-none');
  }

  // 영화가 없는 경우 메시지 표시
  if (movies.length === 0) {
    if (currentSearchKeyword || currentStartYear || currentEndYear) {
      movieList.innerHTML = '<li class="list-group-item text-center">검색 결과가 없습니다.</li>';
    } else {
      movieList.innerHTML = '<li class="list-group-item text-center">등록된 영화가 없습니다.</li>';
    }
    return;
  }

  movies.forEach((movie) => {
    // 사용 불가능한 영화에 대한 스타일과 텍스트 설정
    const hiddenClass = !movie.isUsable ? " text-muted" : "";
    const hiddenStyle = !movie.isUsable ? 'style="color: gray;"' : '';
    const hiddenText = !movie.isUsable ? ' (사용 안 함)' : '';

    const itemHtml = liTemplate
    .replace('{{id}}', movie.id)
    .replace('{{title}}', movie.title)
    .replace('{{releaseYear}}', movie.releaseYear)
    .replace('{{hiddenClass}}', hiddenClass)
    .replace('{{hiddenStyle}}', hiddenStyle)
    .replace('{{hiddenText}}', hiddenText);

    movieList.innerHTML += itemHtml;
  });

  // 버튼 텍스트 업데이트
  const toggleButton = document.getElementById('toggleHiddenMovies');
  if (toggleButton) {
    toggleButton.textContent = showHiddenMovies ? 'Hide Hidden Movies' : 'View Hidden Movies';
  }
}

// 버튼 이벤트 핸들러 설정 함수
export function setupEventHandlers() {
  // toggleHiddenMovies 버튼 이벤트 설정
  const toggleButton = document.getElementById('toggleHiddenMovies');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      // 토글 상태를 반전시키고 영화 목록을 다시 렌더링
      showHiddenMovies = !showHiddenMovies;
      renderAllMovies();
    });
  }

  // 검색 버튼 이벤트 설정
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      performSearch();
    });
  }

  // 검색 입력 필드에서 Enter 키 이벤트 처리
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // 시작 개봉년도 입력 필드에서 Enter 키 이벤트 처리
  const startYearInput = document.getElementById('startYearInput');
  if (startYearInput) {
    startYearInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // 종료 개봉년도 입력 필드에서 Enter 키 이벤트 처리
  const endYearInput = document.getElementById('endYearInput');
  if (endYearInput) {
    endYearInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  // 검색 초기화 버튼 이벤트 설정
  const clearSearchButton = document.getElementById('clearSearchButton');
  if (clearSearchButton) {
    clearSearchButton.addEventListener('click', () => {
      // 검색어와 개봉년도 기간 초기화 및 입력 필드 비우기
      currentSearchKeyword = '';
      currentStartYear = '';
      currentEndYear = '';

      if (searchInput) {
        searchInput.value = '';
      }

      if (startYearInput) {
        startYearInput.value = '';
      }

      if (endYearInput) {
        endYearInput.value = '';
      }

      // 영화 목록 다시 로드
      renderAllMovies();
    });
  }
}

// 검색 실행 함수
function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const startYearInput = document.getElementById('startYearInput');
  const endYearInput = document.getElementById('endYearInput');

  if (searchInput) {
    // 검색어 공백 제거 및 저장
    currentSearchKeyword = searchInput.value.trim();
  }

  if (startYearInput) {
    // 시작 개봉년도 값 저장
    currentStartYear = startYearInput.value.trim();
  }

  if (endYearInput) {
    // 종료 개봉년도 값 저장
    currentEndYear = endYearInput.value.trim();
  }

  // 영화 목록 다시 로드
  renderAllMovies();
}

export async function renderMovieDetails(movieId, template) {
  const movie = await fetchMovieDetails(movieId);

  const htmlForDetails = `
    <h5>ID: ${movie.id}</h5>
    <p class="mb-2">Title: ${movie.title}</p>
    <p class="mb-0">Release Year: ${movie.releaseYear}</p>
    <p class="mb-0">Status: ${movie.isUsable ? 'Active' : '<span class="text-muted">Hidden</span>'}</p>
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

  document.getElementById('deleteMovieButton').addEventListener('click', function() {
    // 영화 ID는 페이지 내 적절한 방법(예: input 태그의 value)으로 가져옵니다.
    const movieId = document.getElementById('movieId').value;
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMovie(movieId);
    }
  });
}