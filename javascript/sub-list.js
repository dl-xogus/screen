const el_sortBtn = document.querySelectorAll('.sort-btn a');
const el_list = document.querySelector('.curation .list');
const el_more = document.querySelector('.curation .more');
const el_sideGenBtn = document.querySelectorAll('.genre-btn .genBtn')

let currentSort = 'popularity'; // 기본값
let img_path = 'https://image.tmdb.org/t/p/w200';
let page = 1;


/* sort 버튼 토글 함수 */
let sort_btn_toggle = function (btn) {
    el_sortBtn.forEach(function (b) {
        b.classList.remove('active');
    });

    btn.classList.add('active');
};

/* sort 버튼 이벤트 */
el_sortBtn.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
        sort_btn_toggle(btn);

        currentSort = btn.dataset.sort;

        page = 1;                   // 페이지 초기화
        el_list.innerHTML = '';     // 리스트 초기화

        movieListfetch(page);
    });
});

el_sideGenBtn.forEach(function (btn, i) {

    btn.addEventListener('click', function () {
        btn.classList.toggle('active');
    });
});

let movieListfetch = async function (page) {
    /* 오늘 날짜 생성 */
    const today = new Date().toISOString().split("T")[0];

    let genreNum = [];
    let watchNum = [];

    // /* 인기순 데이터 */
    // let mvPopRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR&watch_region=KR&sort_by=popularity.desc&page=${page}&with_genres=${genreNum}&with_watch_providers=${watchNum}`);
    // let mvPopData = await mvPopRes.json();

    // /* 평점순 데이터 */
    // let mvRateRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR&watch_region=KR&sort_by=vote_average.desc&vote_count.gte=100&page=${page}&with_genres=${genreNum}&with_watch_providers=${watchNum}`);
    // let mvRateData = await mvRateRes.json();

    // /* 최근작품순 데이터 */
    // let mvDayRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR&sort_by=release_date.desc&watch_region=KR&release_date.lte=${today}&page=${page}&with_genres=${genreNum}&with_watch_providers=${watchNum}`);
    // let mvDayData = await mvDayRes.json();

    let sortQuery = '';

    if (currentSort === 'popularity') {     // 인기순
        sortQuery = 'sort_by=popularity.desc';
    }
    else if (currentSort === 'rating') {    // 평점순
        sortQuery = 'sort_by=vote_average.desc&vote_count.gte=100';
    }
    else if (currentSort === 'latest') {    // 최근작품순
        sortQuery = `sort_by=release_date.desc&release_date.lte=${today}`;
    }

    let res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR&watch_region=KR&${sortQuery}&page=${page}&with_genres=${genreNum}&with_watch_providers=${watchNum}`);
    let data = await res.json();

    // let arr = [
    //     { type: '인기순', data: mvPopData.results },
    //     { type: '평점순', data: mvRateData.results },
    //     { type: '최근작품순', data: mvDayData.results }
    // ];

    movieListOutput(data.results);
};

let movieListOutput = function (movies) {

    movies.slice(0, 20).forEach(function (mov, i) {

        let year = mov.release_date.split('-')[0];  // 날짜 년도만 끊어서 저장

        /* 장르id -> 장르이름 변경 후 배열에 저장 */
        let mvGen = JSON.parse(localStorage.moviesGenres);
        let genre = [];

        mvGen.forEach(function (gen, i) {
            if (mov.genre_ids.includes(gen.id)) {
                genre.push(gen.name);
            }
        });

        /* 출력 */
        let noImg = '../image/img_noimage.jpg';

        el_list.innerHTML +=
            `<figure>
                <p class="poster"><img src="${mov.poster_path == null ? noImg : img_path + mov.poster_path}" alt="영화포스터"></p>
                <div class="objs-txt">
                    <p class="name">${mov.title}</p>
                    <p>${year} · ${genre}</p>
                    <p>${mov.vote_average.toFixed(1)}</p>
                </div>
            </figure>`;
    });
};
movieListfetch(page);

el_more.addEventListener('click', function () {
    page++;
    movieListfetch(page);
});

