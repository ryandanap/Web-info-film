// api key : 74a621f7876dcebd7b9464aeda6acf17
// api read : eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDZiNzg4NjJjYjRlNWJmZTI5ODU3OTU3NjE3ZWIyMCIsIm5iZiI6MTczMTM5NjY5Ni44MDYwODU4LCJzdWIiOiI2NzMzMDE0NjEzYmVhZjQ2NWI3M2JiOWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.UguL8KPMIDjpeGSNI_oi2tq7wnzDibVN_7erzFMO4GA

const API_KEY = `74a621f7876dcebd7b9464aeda6acf17`
const image_path = `https://image.tmdb.org/t/p/w1280`
const main_grid_title = document.querySelector('.favorites h1')
const main_grid = document.querySelector('.favorites .movies-grid')


const input = document.querySelector('.search input')
const btn = document.querySelector('.search button')

const trending_el = document.querySelector('.trending .movies-grid')

const popup_container = document.querySelector('.popup-container')

function add_click_effect_to_card (cards) {
  cards.forEach(card => {
      card.addEventListener('click', () => show_popup(card))
  })
}


// cari film
async function get_movie_by_search (search_term) {
  const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`)
  const respData = await resp.json()
  return respData.results
}

btn.addEventListener('click', add_searched_movies_to_dom)

async function add_searched_movies_to_dom () {
  const data = await get_movie_by_search(input.value)

  main_grid_title.innerText = `Film Yang Ditemukan`
  main_grid.innerHTML = data.map(e => {
      return `
          <div class="card" data-id="${e.id}">
              <div class="img">
                  <img src="${image_path + e.poster_path}">
              </div>
              <div class="info">
                  <h2>${e.title}</h2>
                  <div class="single-info">
                      <span>Rate: </span>
                      <span>${e.vote_average} / 10</span>
                  </div>
                  <div class="single-info">
                      <span>Release Date: </span>
                      <span>${e.release_date}</span>
                  </div>
              </div>
          </div>
      `
  }).join('')

  const cards = document.querySelectorAll('.card')
  add_click_effect_to_card(cards)
}



// popup detail
async function get_movie_by_id (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData
}
async function get_movie_trailer (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData.results[0].key
}

async function show_popup (card) {
    popup_container.classList.add('show-popup')

    const movie_id = card.getAttribute('data-id')
    const movie = await get_movie_by_id(movie_id)
    const movie_trailer = await get_movie_trailer(movie_id)

    popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`

    popup_container.innerHTML = `
            <span class="x-icon">&#10006;</span>
            <div class="content">
                <div class="left">
                    <div class="poster-img">
                        <img src="${image_path + movie.poster_path}" alt="">
                    </div>
                </div>
                <div class="right">
                    <h1>${movie.title}</h1>
                    <h3>${movie.tagline}</h3>
                    <div class="single-info-container">
                        <div class="single-info">
                            <span>Language:</span>
                            <span>${movie.spoken_languages[0].name}</span>
                        </div>
                        <div class="single-info">
                            <span>Length:</span>
                            <span>${movie.runtime} minutes</span>
                        </div>
                        <div class="single-info">
                            <span>Rate:</span>
                            <span>${movie.vote_average} / 10</span>
                        </div>
                        <div class="single-info">
                            <span>Budget:</span>
                            <span>$ ${movie.budget}</span>
                        </div>
                        <div class="single-info">
                            <span>Release Date:</span>
                            <span>${movie.release_date}</span>
                        </div>
                    </div>
                    <div class="genres">
                        <h2>Genres</h2>
                        <ul>
                            ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="overview">
                        <h2>Overview</h2>
                        <p>${movie.overview}</p>
                    </div>
                </div>
            </div>
    `
    const x_icon = document.querySelector('.x-icon')
    x_icon.addEventListener('click', () => popup_container.classList.remove('show-popup'))

    const heart_icon = popup_container.querySelector('.heart-icon')

    const movie_ids = get_LS()
    for(let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color')
    }

    heart_icon.addEventListener('click', () => {
        if(heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id)
            heart_icon.classList.remove('change-color')
        } else {
            add_to_LS(movie_id)
            heart_icon.classList.add('change-color')
        }
        fetch_favorite_movies()
    })
}

// trending 
get_trending_movies()
async function get_trending_movies () {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData.results
}

add_to_dom_trending()
async function add_to_dom_trending () {

    const data = await get_trending_movies()
    console.log(data);

    trending_el.innerHTML = data.slice(0, 5).map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

