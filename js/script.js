const path = window.location.pathname;

let apiPath;
let pageNum = 1;


const cardContainer = document.getElementById("popular");
const getApi = async (endpoint) => {
	const URL = "https://api.themoviedb.org/3/";
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
			apiPath = endpoint;
			return result;
		}
	} catch {
		console.log("Error");
	}
};

const getSearchApi = async (endpoint) => {

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmRhMTkxZjVjODE0ZWVkNzQyODY5MTVkNDRhYzFlOSIsInN1YiI6IjY2NDQxZTcyOGNkOGRlNGRiYTFjNjlmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.InKaaOzDj3-W5xpnsT71Hv88wDGAPpEDMEClcFtER1w'
		}
	};
	
	try {
		const response = await fetch(endpoint, options);

		if (!response.ok) {
			throw Error("Not good status");
		} else {
			const result = await response.json();
			apiPath = endpoint;
			return result;
		}
	} catch {
		console.log("Error");
	}
}

async function apiCards(endpoint, page) {
	page = pageNum;

	const { results } = await getApi(`${endpoint}&page=${page}`);

	displayCards(results)
}

function displayCards(results) {
	results.forEach((card) => {
		const div = document.createElement("div");


		div.classList.add("card");

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
        <small class="text-muted">Release: ${
					(path === "/shows.html" || path === "/search-tv.html") ? formatDate(card, 1) : formatDate(card, 3)
				}
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
            <p class="text-muted">Release Date: ${formatDate(results, 3)}</p>
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
}

async function displayShowDetails() {
	const movieId = window.location.search;
	const id = movieId.split("=");

	const results = await getApi(`tv/${id[1]}?language=en-US`);

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
					<p class="text-muted">Release Date: ${formatDate(results, 1)}</p>
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
          <h2>Show Info</h2>
          <ul>
           ${
							results.number_of_episodes
								? ` <li><span class="text-secondary">Number Of Episodes:</span> ${results.number_of_episodes} </li>`
								: `<li><span class="text-secondary">Number Of Episodes:</span> Unknown </li>`
						}
					 ${
							results.number_of_episodes
								? ` <li><span class="text-secondary">Last Air Date:</span> ${formatDate(
										results,
										2
								  )} </li>`
								: `<li><span class="text-secondary">Last Air Date: </span>Unknown </li>`
						}
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

	const container = document.querySelector("#show-details");
	container.appendChild(div);
}

function addCommas(amm) {
	return amm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPath(card) {
	if (path === "/index.html" || path === "/" || path === "/search-movie.html") {
		return `/movie-details.html?id=${card.id}`;
	} else {
		return `/tv-details.html?id=${card.id}`;
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
function formatDate(date, id) {

	if (id === 1) {
		const parts = date.first_air_date.split("-");

		let formatDates = `${parts[1]}/${parts[2]}/${parts[0]}`;

		return formatDates
	}

	if (id == 2) {
		const parts = date.last_air_date.split("-");

		let formatDates = `${parts[1]}/${parts[2]}/${parts[0]}`;

		return formatDates;
	}
	if (id == 3) {
		const parts = date.release_date.split("-");

		let formatDates = `${parts[1]}/${parts[2]}/${parts[0]}`;

		return formatDates;
	}
}


async function searchMovieInput() {

	let userInput = window.location.search;

	let input = userInput.split("=")

	const results = await apiCards(`search/movie?query=${input[1]}`)

}

async function searchTvInput() {

	let userInput = window.location.search;

	let input = userInput.split("=")

	await apiCards(`search/tv?query=${input[1]}`)

}

const backPage = () => {
	window.history.back();
}
async function nextPage() {

	if (pageNum >= 1) {
		pageNum++;
		const endpoint = apiPath.split("=");

		if (path === "/search-movie.html" || path === "/search-tv.html") {
			await apiCards(`${endpoint[0]}=${endpoint[1]}${pageNum}`);
		} else {
			await apiCards(`${endpoint[0]}${pageNum}`);
		}
	} else {
		return;
	}
}
function init() {
	if (path === "/index.html" || path === "/" || path === "/shows.html" || path === "/search-movie.html" || path === "/search-tv.html") {
		document.querySelector(".next-page").addEventListener("click", () => {
			nextPage();
		});
	}

	if (path === "/movie-details.html" || path === "/tv-details.html") {
		document.querySelector("#back-btn").addEventListener("click", () => {
			backPage()
		});
	}


	switch (path) {
		case "/": {
			apiCards("movie/popular?language=en-US");
			break;
		}
		case "/index.html": {
			apiCards("movie/popular?language=en-US");
			break;
		}
		case "/shows.html": {
			apiCards("tv/popular?language=en-US");
			break;
		}
		case "/search-movie.html": {
			searchMovieInput()
			break;
		}
		case "/search-tv.html": {
			searchTvInput()
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
