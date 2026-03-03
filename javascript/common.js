const el_header = document.querySelector('header');
const el_nav = document.querySelector('.header-left nav');
const el_headerIcon = document.querySelector('header .header-icon');
const el_headerSearch = document.querySelector('.header-search');

/* 헤더 검색창 펼침 */
if (el_headerIcon) {
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
}
/* 헤더 추천검색어 */
let headerRecommendFun = async function () {
    const el_recommendSearchKeyword = document.querySelector('.header-search .recommend div');
    el_recommendSearchKeyword.innerHTML = '';

    let res = await fetch('https://api.themoviedb.org/3/trending/all/day?api_key=a3a99689753df933ab4c76e497b6c0b7&language=ko-KR');
    let data = await res.json();

    data.results.slice(0, 3).forEach(item => {
        let title = item.title || item.name;
        el_recommendSearchKeyword.innerHTML += `<a href="./pages/sub-search.html?keyword=${title}">${title}</a>`;
    });
};
headerRecommendFun();

let params = new URLSearchParams(document.location.search);
let keyword = params.get("keyword");


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
//                          인물 팝업 (이태현)
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 필모 스크립트 함수 */
let popup_filmography_func = function (id) {
    const img_path200 = 'https://image.tmdb.org/t/p/w200';
    let filmoNum = 20;      // 필모 초기 출력 갯수

    /* 인물 프로필 출력 함수 */
    let profileOutputFunc = function (detailData, IdsData) {
        const el_filmoProfileImg = document.querySelector('.profile .image');
        const el_filmoName = document.querySelector('.profile .details .name');
        const el_filmoJop = document.querySelector('.profile .details .name');
        const el_genderBirth = document.querySelector('.profile .details .genderBirth');
        const el_filmoIcs = document.querySelectorAll('.profile .details .icons a');

        let gender = detailData.gender == 2 ? '남' : '여';
        let bir = detailData.birthday;
        let [year, month, day] = bir.split('-');
        let birthday = `${year}년 ${month}월 ${day}일`;
        let homeURL = detailData.homepage;
        let instaURL = `https://instagram.com/${IdsData.instagram_id}`;

        el_filmoName.innerHTML = '';
        el_filmoJop.innerHTML = '';

        // 프로필 사진
        el_filmoProfileImg.innerHTML = `<img src="${img_path200 + detailData.profile_path}">`;
        // 이름
        el_filmoName.innerHTML += `<h2>${detailData.name}</h2>`;
        // 전문분야(직업)
        el_filmoJop.innerHTML += `<p>${detailData.known_for_department}</p  >`;
        // 성별, 출생
        el_genderBirth.innerHTML = `
            <p><b>성별</b> : ${gender}</p>
            <p><b>출생</b> : ${birthday}</p>`;
        // 아이콘 링크
        el_filmoIcs[0].setAttribute("href", `${instaURL}`);
        el_filmoIcs[1].setAttribute("href", `${homeURL}`);
    };

    /* 대표작 출력 함수 */
    let castOutputFunc = function (castData) {
        const el_filmoPosters = document.querySelector('.appear .posters');
        const noImg = '../image/img_noimage.jpg';

        el_filmoPosters.innerHTML = '';

        castData.cast.slice(0, 12).forEach(function (ca, i) {
            let posterImg = img_path200 + ca.poster_path;

            el_filmoPosters.innerHTML += `<a class="po" data-id="${ca.id}"><img src="${ca.poster_path ? posterImg : noImg}"></a>`;
        });
    };

    /* 필모 출력 함수 */
    let filmoOutputFunc = function (castData) {
        const el_filmoText = document.querySelector('.filmo .box');

        el_filmoText.innerHTML = '';

        /* 날짜 있는 것만 최신순으로 영화, TV 모두 필터링해서 sorted에 저장 */
        let sorted = castData.cast
            .filter(ca => ca.release_date || ca.first_credit_air_date)     // 영화일때 TV일때 날짜 둘 다
            .sort((a, b) => {
                let dateA = a.release_date || a.first_credit_air_date;
                let dateB = b.release_date || b.first_credit_air_date;
                return new Date(dateB) - new Date(dateA);           // 최신순 정렬
            })
            .slice(0, filmoNum);

        let prevYear = 0;                                           // 이전 년도

        sorted.forEach(function (ca, i) {
            let date = ca.release_date || ca.first_credit_air_date;        // 영화일때 TV일때 날짜 둘 다
            let year = date.split('-')[0];                          // 연도만 저장

            /* 연도가 바뀌면 line 추가 */
            if (prevYear != year) {
                el_filmoText.innerHTML += `<div class="line"></div>`;
            }

            let title = ca.title || ca.name;                        // 영화일때 TV일때 제목 둘 다

            el_filmoText.innerHTML += `
            <div class="details">
                <p class="year">${year}</p>
                <div class="text">
                    <a data-id="${ca.id}">${title}</a>
                    <p>${ca.character || ''}</p>
                </div>
            </div>`;                                            // ca.character || '' : 역할이 값이 없는경우 ''출력

            prevYear = year;                                        // 이번 횟수의 년도 전 년도에 저장
        });
    };

    /* More 버튼 함수 */
    let moreFunc = function (castData) {
        const el_filmoMore = document.querySelector('.filmo .more');

        /* 날짜 있는 데이터만 필터 */
        let filtered = castData.cast
            .filter(ca => ca.release_date || ca.first_credit_air_date)     // 영화일때 TV일때 날짜 둘 다
            .sort((a, b) => {
                let dateA = a.release_date || a.first_credit_air_date;
                let dateB = b.release_date || b.first_credit_air_date;
                return new Date(dateB) - new Date(dateA);           // 최신순 정렬
            });

        filmoOutputFunc(castData);                      // 최초 출력

        /* 버튼 표시 여부 체크 함수 */
        let checkMoreBtn = function () {
            if (filmoNum >= filtered.length) {          // 정보가 없다면
                el_filmoMore.style.display = 'none';    // 버튼 안보이게
            } else {
                el_filmoMore.style.display = 'flex';
            }
        };

        checkMoreBtn();  // 처음부터 부족하면 숨김

        /* More 버튼 이벤트 */
        el_filmoMore.addEventListener('click', function () {
            filmoNum += 10;                 // 누르면 10개씩 늘어나게
            filmoOutputFunc(castData);      // 출력
            checkMoreBtn();                 // 더 이상 정보가 없어서 버튼을 없앨지 체크
        });
    };

    /* 인물 데이터들 불러오기 */
    let personDataFunc = async function (id) {
        const defaultURL = 'https://api.themoviedb.org/3';
        const APIkey = 'a3a99689753df933ab4c76e497b6c0b7';

        // let id = 10980;

        /* 인물 상세 정보 */
        let detailRes = await fetch(`${defaultURL}/person/${id}?api_key=${APIkey}&language=ko-KR`);
        let detailData = await detailRes.json();

        /* 인물의 ID들 정보 */
        let IdsDataRes = await fetch(`${defaultURL}/person/${id}/external_ids?api_key=${APIkey}`);
        let IdsData = await IdsDataRes.json();

        /* 인물 출연 정보 */
        let castRes = await fetch(`${defaultURL}/person/${id}/combined_credits?api_key=${APIkey}&language=ko-KR`);
        let castData = await castRes.json();

        profileOutputFunc(detailData, IdsData);
        castOutputFunc(castData);
        moreFunc(castData);
    };

    personDataFunc(id);     // 전체 실행 호출문
};

/* 인물 클릭했을때 */
window.addEventListener('click', function (e) {
    const card = e.target.closest('.person-card');
    if (!card) return;                  // person-card가 아니면 무시

    let personId = card.dataset.id;           // 클릭한 태그에 걸린 data-id값을 가져옴

    if (document.querySelector('#popup-filmography')) return; // 이미 있으면 또 생성 안함

    $('body').append('<div id="popup-filmography"></div>');
    $('#popup-filmography').load('./popup-filmography.html', function () {
        document.body.classList.add('popup-open');   // 스크롤 막기
        popup_filmography_func(personId);     // load 끝난 후 실행
    });
});

/* 팝업창 x버튼눌러서 끄기 */
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-x')) {
        document.body.classList.remove('popup-open');
        document.querySelector('#popup-filmography').remove();  // html에 추가했던 팝업을 지움
    }
});
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
//                          인물 팝업 (이태현)
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */