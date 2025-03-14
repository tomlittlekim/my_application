export async function fetchMovies(includeHidden = false) {
  const query = `
    query {
      allMovies(includeHidden: ${includeHidden}) {
        id
        title
        releaseYear
        isUsable
      }
    }
  `;
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ERROR! STATUS: ${response.status}`);
    }
    const result = await response.json();
    return result.data.allMovies;
  } catch (error) {
    console.error(`Failed to fetch movies: ${error}`);
    alert(`Failed to fetch movies. Please try again later.`);
  }
}

export async function fetchMovieDetails(id) {
  const query = `
    query {
      movie(id: "${id}") {
        id
        title
        releaseYear
        isUsable
      }
    }
  `;
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    });
    const result = await response.json();
    return result.data.movie;
  } catch (error) {
    console.error(`Failed to fetch movie details: ${error}`);
    alert(`Failed to fetch movie details. Please try again later.`);
  }
}

export async function addMovie(title, releaseYear) {
  const mutation = `
    mutation {
      addMovie(title: "${title}", releaseYear: ${releaseYear}) {
        id
        title
        releaseYear
        isUsable
      }
    }
  `;
  try {
    const response = await fetch(`/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ERROR! STATUS: ${response.status}`);
    }
    const result = await response.json();
    return result.data.addMovie;
  } catch (error) {
    console.error(`Failed to add movie: ${error}`);
    throw error;
  }
}

export async function updateMovie(id, title, releaseYear, isUsable) {
  const mutation = `
    mutation {
      updateMovie(id: "${id}", title: "${title}", releaseYear: ${releaseYear}, isUsable: ${isUsable}) {
        id
        title
        releaseYear
        isUsable
      }
    }
  `;
  try {
    const response = await fetch(`/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ERROR! STATUS: ${response.status}`);
    }
    const result = await response.json();
    return result.data.updateMovie;
  } catch (error) {
    console.error(`Failed to update movie: ${error}`);
    throw error;
  }
}

export async function deleteMovie(id) {
  const mutation = `
    mutation {
      realDeleteMovie(id: "${id}")
    }
  `
  fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  .then(response => response.json())
  .then(data => {
    if (data.data.realDeleteMovie) {
      alert("영화가 삭제되었습니다.");
      // 삭제 후 영화 목록 페이지로 이동하는 등 추가 처리를 할 수 있습니다.
      window.location.href = '/';
    } else {
      alert("영화 삭제에 실패했습니다.");
    }
  })
  .catch(error => console.error("Error deleting movie: ", error));
}