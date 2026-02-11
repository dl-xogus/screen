const el_header = document.querySelector('header');
const el_nav = document.querySelector('.header-left nav');
const el_headerIcon = document.querySelector('.header-icon');
const el_headerSearch = document.querySelector('.header-search');

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