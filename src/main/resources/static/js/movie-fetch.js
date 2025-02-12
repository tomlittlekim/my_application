export async function fetchMovies() {
  const query = `
    query {
      allMovies {
        id
        title
        releaseYear
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