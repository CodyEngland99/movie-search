const path = window.location.pathname;
const cardContainer = document.getElementById("popular");
const getApi = async (endpoint, page) => {
	const URL = "https://api.themoviedb.org/3/";
	const path = endpoint;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmRhMTkxZjVjODE0ZWVkNzQyODY5MTVkNDRhYzFlOSIsInN1YiI6IjY2NDQxZTcyOGNkOGRlNGRiYTFjNjlmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.InKaaOzDj3-W5xpnsT71Hv88wDGAPpEDMEClcFtER1w",
		},
	};

	try {
		const response = await fetch(`${URL}${endpoint}`, options);

		if (!response.ok) {
			throw Error("Not good status");
		} else {
			const result = await response.json();
			return result;
		}
	} catch {
		console.log("Error");
	}
};

async function displayCards(endpoint) {
	const { results } = await getApi(endpoint);

	console.log(results);

	results.forEach((card) => {
		const div = document.createElement("div");

		div.classList.add("card");
		// ! SETTING SHOW/MOVIE ID TO GET FOR DETAILS
		div.setAttribute("data-id", card.id);

		div.innerHTML = `
    <a href="${getPath(card)}">
    ${
			card.poster_path
				? `
       <img
        src="https://image.tmdb.org/t/p/w500${card.poster_path}"
        class="card-img-top"
        alt="Movie Title"
      />
      `
				: `
      <img
       src="images/no-image.jpg"
       class="card-img-top"
       alt="Movie Title"
     />
     `
		}
     
    </a>
    <div class="card-body">
      <h5 class="card-title">${checkingTitle(card)}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${formatDate(card)}
        </small>
      </p>
    </div>
    `;

		cardContainer.appendChild(div);
	});
}

async function displayMovieDetails() {
	const movieId = window.location.search;
	const id = movieId.split("=");

	const results = await getApi(`movie/${id[1]}?language=en-US`);

	const div = document.createElement("div");

	div.innerHTML = `
  <div class="details-top">
          <div>
          ${
						results.poster_path
							? `
             <img
              src="https://image.tmdb.org/t/p/w500${results.poster_path}"
              class="card-img-top"
              alt="Movie Title"
            />
            `
							: `
            <img
             src="images/no-image.jpg"
             class="card-img-top"
             alt="Movie Title"
           />
           `
					}
          </div>
          <div>
            <h2>${checkingTitle(results)}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.round(results.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${formatDate(results)}</p>
            <p>
              ${results.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              <li>${results.genres[0].name}</li>
              ${results.genres[1] ? `<li>${results.genres[1].name}</li>` : ``}
              ${results.genres[2] ? `<li>${results.genres[2].name}</li>` : ``}
            </ul>
            <a href="${results.homepage ? results.homepage : ``}" ${
		results.homepage
			? `target="_blank" class="btn"> View Home Page`
			: `No Home Page `
	}</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${
							results.budget === 0 ? `Unknown` : addCommas(results.budget)
						}</li>
            <li><span class="text-secondary">Revenue:</span>  ${
							results.revenue === 0 ? `Unknown` : addCommas(results.revenue)
						}</li>
            <li><span class="text-secondary">Runtime:</span>  ${
							results.runtime === 0 ? `Unknown` : results.runtime
						} Minutes</li>
            <li><span class="text-secondary">Status:</span> ${
							results.status === 0 ? `Unknown` : results.status
						}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          <ul> 
          ${
						results.production_companies[0]
							? `<li>${results.production_companies[0].name}</li>`
							: ``
					}
          ${
						results.production_companies[1]
							? `<li>${results.production_companies[1].name}</li>`
							: ``
					}
          ${
						results.production_companies[2]
							? `<li>${results.production_companies[2].name}</li>`
							: ``
					}
          </ul>
         </div>
        </div>
  `;

	const backDrop = document.querySelector(".back-drop");
	backDrop.style.background = `url(https://image.tmdb.org/t/p/original${results.backdrop_path}) center center/cover no-repeat`;

	const container = document.querySelector("#movie-details");
	container.appendChild(div);

	console.log(results);
}

async function displayShowDetails() {
	const movieId = window.location.search;
	const id = movieId.split("=");

	const results = await getApi(`tv/${id[1]}?language=en-US`);

	console.log(results);
}

function addCommas(amm) {
	return amm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPath(card) {
	if (path === "/index.html" || path === "/") {
		return `/movie-details.html?id=${card.id}`;
	} else {
		return "/tv-details.html?id=1";
	}
}

// ! RETURNING THE CORRECT TITLE INFORMATION SINCE API HAS DIFFRENT NAMES FOR TITLE
function checkingTitle(card) {
	if (card.original_title) {
		return card.original_title;
	} else {
		return card.original_name;
	}
}

// ! RETURNING THE CORRECT DATE INFORMATION SINCE API HAS DIFFRENT NAMES FOR TITLE
function formatDate(date) {
	if (date.first_air_date) {
		const parts = date.first_air_date.split("-");

		let formatDates = `${parts[1]}/${parts[2]}/${parts[0]}`;

		return formatDates;
	} else {
		const parts = date.release_date.split("-");

		let formatDates = `${parts[1]}/${parts[2]}/${parts[0]}`;

		return formatDates;
	}
}

async function prevPage() {
	let pageNum = 1;
	const page = `&page=${pageNum++}`;

	if (pageNum === 1) {
		return;
	} else {
		displayCards(page);
	}
}

function init() {
	switch (path) {
		case "/": {
			displayCards("movie/popular?language=en-US&page=");
			break;
		}
		case "/index.html": {
			displayCards("movie/popular?language=en-US&page=");
			break;
		}
		case "/shows.html": {
			displayCards("tv/popular?language=en-US&&page=");
			break;
		}
		case "/search.html": {
			break;
		}
		case "/movie-details.html": {
			displayMovieDetails();
			break;
		}
		case "/tv-details.html": {
			displayShowDetails();
			break;
		}
	}
}

document.addEventListener("DOMContentLoaded", init);
const prev = document
	.getElementById("prev")
	.addEventListener("click", prevPage);
