/* movie 장르 로컬스토리지 저장 */
let moviesGenresFun = async function () {
    let res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=ko-KR&api_key=a3a99689753df933ab4c76e497b6c0b7');
    let data = await res.json();

    localStorage.moviesGenres = JSON.stringify(data.genres);
};

/* tv 장르 로컬스토리지 저장 */
let tvGenresFun = async function () {
    let res = await fetch('https://api.themoviedb.org/3/genre/tv/list?language=ko-KR&api_key=a3a99689753df933ab4c76e497b6c0b7');
    let data = await res.json();

    localStorage.tvGenres = JSON.stringify(data.genres);
};




// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                        개봉예정
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const el_mainVideo = document.querySelector('.video-wrap iframe');
const el_subVideo = document.querySelectorAll('.video a');
const el_thumb = document.querySelectorAll('.video .thumb img');
const el_thumbName = document.querySelectorAll('.video .name');

/* 데이터 호출 */
let soonCallFun = async function () {
    let soonRes = await fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR');
    let soonData = await soonRes.json();

    let img_path = 'https://image.tmdb.org/t/p/w300';

    let videoCount = 0;             // 영상 들어간 개수 체크

    for (let i = 0; i < soonData.results.length; i++) {

        if (videoCount >= 4) break; // 4개 채우면 종료

        let soon = soonData.results[i];

        let detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${soon.id}/videos?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR`);
        let detailsData = await detailsRes.json();

        /* 영상이 없으면 넘어가기 */
        if (!detailsData.results || detailsData.results.length === 0) {
            continue;
        }

        let videoKey = detailsData.results[0].key;

        let youtubeLink = `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&loop=1&playlist=${videoKey}&controls=0`;

        el_thumbName[videoCount].innerText = soon.title;
        el_thumb[videoCount].src = img_path + soon.backdrop_path;
        el_subVideo[videoCount].href = youtubeLink;

        if (videoCount === 0) {
            el_mainVideo.src = youtubeLink;
        }

        videoCount++;
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                         TOP 10
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const el_topTabBtn = document.querySelectorAll('.top-tab button');
const el_topContents = document.querySelectorAll('.top-contents');
const el_topMovies = document.querySelector('.top-movies');
const el_topTv = document.querySelector('.top-tv');

/* 버튼 토글 함수 */
let top_btn_toggle = function (btn) {
    el_topTabBtn.forEach(function (b) {
        b.classList.remove('active');
    });

    btn.classList.add('active');
};

/* 버튼에 해당하는 컨텐츠 변경 함수 */
let top_change = function (i) {
    el_topContents.forEach(function (con, j) {
        con.classList.remove('active');
    });

    el_topContents[i].classList.add('active');
};

/* 탭 버튼 이벤트 */
el_topTabBtn.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
        top_btn_toggle(btn);
        top_change(i);
    });
});

const el_topMovieOutput = document.querySelector('.top-movies .top10');
const el_topTvOutput = document.querySelector('.top-tv .top10');

/* popular 영화, tv 데이터 호출 */
let topCallFun = async function () {
    let moviesRes = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc');
    let moviesData = await moviesRes.json();

    let tvRes = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=a3a99689753df933ab4c76e497b6c0b7&include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc');
    let tvData = await tvRes.json();

    top10DomControl(moviesData.results, tvData.results);
};

/* dom 출력 */
let top10DomControl = function (movie, tv) {
    let img_path = 'https://image.tmdb.org/t/p/w300';

    el_topMovieOutput.innerHTML = '';
    el_topTvOutput.innerHTML = '';

    movie.slice(0, 10).forEach(function (mov, i) {
        el_topMovieOutput.innerHTML +=
            `<a href="#" class="slide ${i === 9 ? 'last' : ''}">
                <span ${i === 9 ? 'class="ten"' : ''}>${i + 1}</span>
                <p class="img-wrap"><img src="${img_path + mov.poster_path}"></p>
            </a>`;
    });

    tv.slice(0, 10).forEach(function (t, i) {
        el_topTvOutput.innerHTML +=
            `<a href="#" class="slide ${i === 9 ? 'last' : ''}">
                <span ${i === 9 ? 'class="ten"' : ''}>${i + 1}</span>
                <p class="img-wrap"><img src="${img_path + t.poster_path}"></p>
            </a>`;
    });
};



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//                          추천목록
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const el_recommendTabBtn = document.querySelectorAll('.recommend-tab button');
const el_recommendContents = document.querySelectorAll('.recommend-contents');
const el_recommendAll = document.querySelector('.recommend-all');
const el_recommendMovies = document.querySelector('.recommend-movies');
const el_recommendTv = document.querySelector('.recommend-tv');

/* 버튼 토글 함수 */
let recommend_btn_toggle = function (btn) {
    el_recommendTabBtn.forEach(function (b) {
        b.classList.remove('active');
    });

    btn.classList.add('active');
};

/* 버튼에 해당하는 컨텐츠 변경 함수 */
let recommend_change = function (i) {
    el_recommendContents.forEach(function (con, j) {
        con.classList.remove('active');
    });

    el_recommendContents[i].classList.add('active');
};

/* 탭 버튼 이벤트 */
el_recommendTabBtn.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
        recommend_btn_toggle(btn);
        recommend_change(i);
        recommendMoviesRandom();
        recommendTvRandom();
    });
});




const el_recomMovieOutput = document.querySelector('.mov');
const el_recomdTvOutput = document.querySelector('.tvpro');
const el_recomAniOutput = document.querySelector('.animation');

/* top rated 데이터 호출 */
let recommendCallFun = async function () {
    let movieRes = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200');
    let movieData = await movieRes.json();

    let tvRes = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=a3a99689753df933ab4c76e497b6c0b7&include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=vote_average.desc&without_genres=16,99,10755&vote_count.gte=200');
    let tvData = await tvRes.json();

    let aniRes = await fetch('https://api.themoviedb.org/3/discover/tv?api_key=a3a99689753df933ab4c76e497b6c0b7&include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=vote_average.desc&with_genres=16&vote_count.gte=200');
    let aniData = await aniRes.json();

    recommendDomControl(movieData.results, tvData.results, aniData.results);
};

/* dom 출력 */
let recommendDomControl = function (movie, tv, ani) {
    let img_path = 'https://image.tmdb.org/t/p/w200';

    el_recomMovieOutput.innerHTML = '';
    el_recomdTvOutput.innerHTML = '';
    el_recomAniOutput.innerHTML = '';

    movie.slice(0, 16).forEach(function (mov, i) {
        el_recomMovieOutput.innerHTML +=
            `<a href="#" class="slide">
                <img src="${img_path + mov.poster_path}">
            </a>`;
    });
    tv.slice(0, 16).forEach(function (t, i) {
        el_recomdTvOutput.innerHTML +=
            `<a href="#" class="slide">
                <img src="${img_path + t.poster_path}">
            </a>`;
    });
    ani.slice(0, 16).forEach(function (an, i) {
        el_recomAniOutput.innerHTML +=
            `<a href="#" class="slide">
                <img src="${img_path + an.poster_path}">
            </a>`;
    });
};

/* movie 랜덤 장르 3개 뽑기 */
let getRndMoviesGenres = function () {
    let genres = JSON.parse(localStorage.moviesGenres);
    let shuffled = genres.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

/* movie 랜덤 장르 기반 출력 */
let recommendMoviesRandom = async function () {
    let container = document.querySelector('.recommend-movies');
    container.innerHTML = '';

    let randomGenres = getRndMoviesGenres();

    for (let genre of randomGenres) {
        let res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR&sort_by=popularity.desc&with_genres=${genre.id}`);
        let data = await res.json();

        let html =
            `<article>
                <div class="title">
                    <h2>${genre.name}</h2>
                    <a href="#">더보기<img src="./image/ic_right.svg"></a>
                </div>
                <div class="swiper wrapper">`;

        data.results.slice(0, 16).forEach(function (movie) {
            html +=
                `<a href="#" class="slide">
                    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}">
                </a>`;
        });

        html += `</div></article>`;

        container.innerHTML += html;
    }
};

/* tv 랜덤 장르 3개 뽑기 */
let getRndTvGenres = function () {
    let genres = JSON.parse(localStorage.tvGenres);
    let shuffled = genres.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

/* tv 랜덤 장르 기반 출력 */
let recommendTvRandom = async function () {
    let container = document.querySelector('.recommend-tv');
    container.innerHTML = '';

    let randomGenres = getRndTvGenres();

    for (let genre of randomGenres) {
        let res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR&sort_by=popularity.desc&with_genres=${genre.id}`);
        let data = await res.json();

        let html =
            `<article>
                <div class="title">
                    <h2>${genre.name}</h2>
                    <a href="#">더보기<img src="./image/ic_right.svg"></a>
                </div>
                <div class="swiper wrapper">`;

        data.results.slice(0, 16).forEach(function (tv) {
            html +=
                `<a href="#" class="slide">
                    <img src="https://image.tmdb.org/t/p/w200${tv.poster_path}">
                </a>`;
        });

        html += `</div></article>`;

        container.innerHTML += html;
    }
};



let init = async function () {
    await moviesGenresFun();
    await tvGenresFun();

    topCallFun();
    recommendCallFun();


    soonCallFun();
};
init();