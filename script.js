function formatVotes(votesString) {
  if (!votesString || votesString === "N/A") return "N/A";
  const num = parseInt(votesString.replace(/,/g, ""));
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";
  return num.toString();
}

const API_BASE_URL = "/api/movies";

const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const movieDetails = document.getElementById("movieDetails");
const loader = document.getElementById("loader");

function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

searchBox.addEventListener(
  "input",
  debounce(function () {
    const query = searchBox.value.trim();

    if (query.length < 3) {
      suggestions.style.display = "none";
      return;
    }

    fetch(`${API_BASE_URL}?s=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "True" && data.Search) {
          displaySuggestions(data.Search.slice(0, 5));
        } else {
          suggestions.style.display = "none";
        }
      })
      .catch((err) => {
        console.error("Error fetching suggestions:", err);
        suggestions.style.display = "none";
      });
  }, 500)
);

function displaySuggestions(movies) {
  suggestions.innerHTML = "";

  movies.forEach((movie) => {
    const item = document.createElement("div");
    item.className = "suggestion-item";

    const poster = movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/40x60?text=No+Image";

    item.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" onerror="this.src='https://via.placeholder.com/40x60?text=Error'">
      <div class="suggestion-details">
        <div class="suggestion-title">${movie.Title}</div>
        <div class="suggestion-year">${movie.Year}</div>
      </div>
    `;

    item.addEventListener("click", () => {
      searchBox.value = movie.Title;
      suggestions.style.display = "none";
      fetchMovieDetails(movie.Title);
    });

    suggestions.appendChild(item);
  });

  suggestions.style.display = "block";
}

searchBtn.addEventListener("click", () => {
  const query = searchBox.value.trim();
  if (query) {
    suggestions.style.display = "none";
    fetchMovieDetails(query);
  }
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchBox.value.trim();
    if (query) {
      suggestions.style.display = "none";
      fetchMovieDetails(query);
    }
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    suggestions.style.display = "none";
  }
});

function fetchMovieDetails(movieName) {
  loader.style.display = "block";
  movieDetails.style.display = "none";

  fetch(`${API_BASE_URL}?t=${encodeURIComponent(movieName)}`)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";

      if (data.Response === "False") {
        movieDetails.innerHTML = `
          <div class="error-message">
            <h3>❌ Movie not found</h3>
            <p>Please try a different title or check your spelling.</p>
          </div>
        `;
        movieDetails.style.display = "block";
        return;
      }

      displayMovieDetails(data);
    })
    .catch((error) => {
      loader.style.display = "none";
      console.error("Error:", error);
      movieDetails.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Error</h3>
          <p>An error occurred while fetching movie data. Please try again later.</p>
        </div>
      `;
      movieDetails.style.display = "block";
    });
}

function displayMovieDetails(movie) {
  const poster = movie.Poster !== "N/A"
    ? movie.Poster
    : "https://via.placeholder.com/300x450?text=No+Image";

  movieDetails.innerHTML = `
    <div class="movie-grid">
      <div class="poster-container">
        <img src="${poster}" alt="${movie.Title}" onerror="this.src='https://via.placeholder.com/300x450?text=Error'">
      </div>
      <div class="info-container">
        <h2 class="movie-title">${movie.Title}</h2>
        <div class="movie-year">${movie.Year} • ${movie.Runtime}</div>
        <div class="movie-meta">
          ${movie.Genre.split(", ").map((genre) => `<span class="meta-item">${genre}</span>`).join("")}
        </div>
        ${movie.imdbRating !== "N/A" ? `
          <div class="rating">
            <span class="rating-value">${movie.imdbRating}</span>
            <span class="rating-count">IMDb (<span style="color:rgb(255, 251, 0);">${formatVotes(movie.imdbVotes)}</span> votes)</span>
          </div>` : ''}
        <div class="movie-section">
          <h3 class="section-title">Overview</h3>
          <p>${movie.Plot}</p>
        </div>
        <div class="movie-section">
          <h3 class="section-title">Cast</h3>
          <p>${movie.Actors}</p>
        </div>
        <div class="movie-section">
          <h3 class="section-title">Director</h3>
          <p>${movie.Director}</p>
        </div>
        ${movie.Awards !== "N/A" ? `
          <div class="movie-section">
            <h3 class="section-title">Awards</h3>
            <p>${movie.Awards}</p>
          </div>` : ''}
      </div>
    </div>
  `;

  movieDetails.style.display = "block";
}
