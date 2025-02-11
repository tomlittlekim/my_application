function renderAllMovies(movies) {
  const movieList = document.getElementById('movieList');
  movies.forEach((movie) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="/movie-details.html?id=${movie.id}">
        ${movie.title}
      </a> (${movie.releaseYear})
    `;
    movieList.appendChild(li);
  });
}

function renderMovieDetails(movie) {
  const movieDetails = document.getElementById('movieDetails');
  movieDetails.innerHTML = `
    <p>ID: ${movie.id}</p>
    <p>Title: ${movie.title}</p>
    <p>Release Year: ${movie.releaseYear}</p>
  `;
}