// Kinolar ro'yxatini DOM dan olib topib oldik
const genres = [];

// DOM ga oid elementlarni olib kelish
const elFormSearch = document.querySelector(".search-form");
const elFormSearchInput = elFormSearch.querySelector(".search-input");
const elSortSelect = elFormSearch.querySelector('.genres-select');
const elStartYearInput = elFormSearch.querySelector(".js-start-year-input");
const elEndYearInput = elFormSearch.querySelector(".js-end-year-input");
const elSortMovies = elFormSearch.querySelector('.js-sort-select');



const elMoviesList = document.querySelector(".movies__list");



// MODAL elements

// Samandar aytgan yo'lida qilgan ma'qul
const elModal = document.querySelector(".modal");
const elModalTitle = elModal.querySelector(".movie-info-modal__title");
const elModalRating = elModal.querySelector(".movie-info-modal__rating");
const elModalYear = elModal.querySelector(".movie-info-modal__year");
const elModalDuration = elModal.querySelector(".movie-info-modal__duration");
const elModalYouTubeIframe = elModal.querySelector(".movie-info-modal__iframe");
const elModalCotegory = elModal.querySelector(".movie-info-modal__categories");
const elModalSummary = elModal.querySelector(".movie-info-modal__summary");
const elModalImDbId = elModal.querySelector(".movie-info-modal__imdb-link");



// Template ya'ni Qolibni DOM dan topib oldik
const elMoviesListTemplate = document.querySelector("#movies-item-template").content;

// Soat va Minutni hisoblovchi funksiya yaratdik
function getHoursAndMinuts(minut) {
    
    let hours = Math.floor(minut / 60);
    let minuts = Math.floor(minut % 60);
    
    return `${hours} hrs ${minuts} min`;
}

function genresList() {
    
    fullMovies.forEach(film => {
        const genresMovies = film.categories;
        
        genresMovies.forEach(category => {
            if (!genres.includes(category)) {
                genres.push(category);
            }
        });
    });
    genres.sort();
}

function showMoviesGenresOption() {
    
    const newSelectFragment = document.createDocumentFragment();
    
    genres.forEach(genre => {
        
        const newMoviesOption = document.createElement("option");
        
        newMoviesOption.textContent = genre;
        newMoviesOption.value = genre;
        newSelectFragment.appendChild(newMoviesOption);
    });
    elSortSelect.appendChild(newSelectFragment);
}



// Kinolarni sahifaga chiqaruvchi funksiy yaratdik
function showMovies(movie, titleRegex = "") {
    
    elMoviesList.innerHTML = "";
    
    
    const moviesFragment = document.createDocumentFragment();
    
    for (const kino of movie) {
        
        // Qolibni ichidagi hamma elemnetlarni olib berish uchun yozilgan code
        const moviesCloneTemplate = elMoviesListTemplate.cloneNode(true);
        
        moviesCloneTemplate.querySelector(".movie__img").src = kino.youtubePoster;
        
        
        if(titleRegex.source !== "(?:)" && titleRegex){
            
            moviesCloneTemplate.querySelector(".movie__title").innerHTML = kino.title.replace(titleRegex,
                `<mark class="p-0 bg-warning">${titleRegex.source}</mark>`);
            }else{
                moviesCloneTemplate.querySelector(".movie__title").textContent = kino.title;
            }
            
            
            moviesCloneTemplate.querySelector(".movie__rating").textContent = kino.imdbRating;
            moviesCloneTemplate.querySelector(".movie__year").textContent = kino.year;
            moviesCloneTemplate.querySelector(".movie__duration").textContent = getHoursAndMinuts(kino.runtime);
            moviesCloneTemplate.querySelector(".movie__categories").textContent = kino.categories.join(", ");
            moviesCloneTemplate.querySelector(".js-more-info-button").dataset.imdbId = kino.imdbId;
            
            moviesFragment.appendChild(moviesCloneTemplate);
        }
        elMoviesList.appendChild(moviesFragment);
    }
    
    
    function showModalInfo(movieId) {
        let findMovie = fullMovies.find(function (element) {
            return element.imdbId === movieId;
        })
        elModalTitle.textContent = findMovie.title;
        elModalRating.textContent = findMovie.imdbRating;
        elModalYear.textContent = findMovie.year;
        elModalDuration.textContent = getHoursAndMinuts(findMovie.runtime);
        elModalYouTubeIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.youtubeId}`;
        elModalCotegory.textContent = findMovie.categories.join(", ");
        elModalSummary.textContent = findMovie.summary;
        elModalImDbId.href = `https://www.imdb.com/title/${findMovie.imdbId}`
        
    }
    
    
    function showSearchMovies(items) {
        
        return fullMovies.filter(movie => {
            
            const meetsCriteria = movie.title.match(items) && (elSortSelect.value === "All" ||
            movie.categories.includes(elSortSelect.value))  && (elStartYearInput.value.trim() ===''
            || movie.year >= Number(elStartYearInput.value)) && (elEndYearInput.value.trim() ===''
            || movie.year <= Number(elEndYearInput.value));
            return meetsCriteria;
        });
    }
    
    
    function sortMoviesList(sortedArray, sortType) {
        
        if (sortType === "a-z") {
            sortedArray.sort((a , b) => {
                if(a.title < b.title) return -1
                else if (a.title > b.title) return 1
                else return 0
            })
        }
        else if(sortType === "z-a"){
            sortedArray.sort((a,b) =>  b.title.charCodeAt(0) - a.title.charCodeAt(0));
        }
        else if (sortType === "tohigh"){
            sortedArray.sort((a,b) => a.imdbRating - b.imdbRating);
        }
        else if (sortType === "tolow"){
            sortedArray.sort(function(a,b) {
                return b.imdbRating - a.imdbRating;
            });
        }
        else if (sortType === "year-old"){
            sortedArray.sort((a,b) => a.year - b.year);
        }
        else if (sortType === "year-new"){
            sortedArray.sort((a,b) => b.year - a.year);
        }
        
        
    }
    
    
    elFormSearch.addEventListener("submit", function (evt) {
        evt.preventDefault();
        
        const searchElement = new RegExp(elFormSearchInput.value.trim(), 'gi');
        
        const searchMovieFilteredList = showSearchMovies(searchElement);
        
        if (searchMovieFilteredList.length > 0) {
            
            sortMoviesList(searchMovieFilteredList, elSortMovies.value);
            
            showMovies(searchMovieFilteredList, searchElement);
            
        } else {
            //  let notFount = ``;
            alert("Movie not found")
        }
        
        // elFormSearchInput.value = "";
    });
    














    
    
    // Event Delegation
    elMoviesList.addEventListener("click", function (evt) {
        if (evt.target.matches(".js-more-info-button")) {
            showModalInfo(evt.target.dataset.imdbId);
        }
    })
    
    
    elModal.addEventListener("hidden.bs.modal", function () {
        elModalYouTubeIframe.src = "";
    })
    
    
    genresList();
    
    showMoviesGenresOption();
    
    showMovies(fullMovies.slice(0, 10));