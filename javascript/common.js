const el_header = document.querySelector('header');
const el_nav = document.querySelector('.header-left nav');
const el_headerIcon = document.querySelector('.header-icon');
const el_headerSearch = document.querySelector('.header-search');

/* 헤더 검색창 펼침 */
el_headerIcon.addEventListener('click', function () {
    el_header.classList.toggle('active');
    el_nav.classList.toggle('active');
    el_headerSearch.classList.toggle('active');
    el_headerIcon.classList.toggle('active');

    let contains = el_headerIcon.classList.contains('active');
    if (contains) {
        el_headerIcon.innerHTML = `<img src="../image/ic_x.svg" alt="검색아이콘">`;
    } else {
        el_headerIcon.innerHTML = `<img src="../image/ic_search.svg" alt="검색아이콘">`;
    }
});

/* 헤더 추천검색어 */
let headerRecommendFun = async function() {
    const el_recommendSearchKeyword = document.querySelector('.header-search .recommend div');
    el_recommendSearchKeyword.innerHTML = '';

    let res = await fetch('https://api.themoviedb.org/3/trending/all/day?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR');
    let data = await res.json();

    data.results.slice(0, 3).forEach(item => {
        let title = item.title || item.name;
        el_recommendSearchKeyword.innerHTML += `<a href="#">${title}</a>`;
    });
};
headerRecommendFun();