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
let headerRecommendFun = async function () {
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





// 무비팝업


$('body').append('<div class="popup-wrap"></div>');
$('.popup-wrap').load('/pages/popup-movieDetails.html', function () {
    //const popup_wrap = document.querySelector('.popup-wrap');
    //const el_slide = document.querySelectorAll('.slide');
    setTimeout(function () {

        $('body').on('click', function (e) {
            e.preventDefault();
            let _this = e.target.parentElement.classList.contains('slide') ? e.target.parentElement : e.target.parentElement.parentElement;
            console.log(_this)
            if (_this.classList.contains('slide')) {

                $('.popup-wrap').css({ 'display': 'flex' });

                let id = _this.getAttribute('data-href');
                let type = _this.getAttribute('data-type');

                if (type == '영화') {
                    popdataFun(id, type);
                }
                else {
                    popdataFunTv(id, type);
                }
            }
        })
    }, 1000)

});

    let popdataFun = async function (id, type) {

    const el_popup = document.querySelector('.popup');
    //로딩 아이콘 출력
    $('.popup-wrap').append(`<div class="loader loader--style2" title="1">
        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
            <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
            <animateTransform attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.6s"
            repeatCount="indefinite"/>
            </path>
        </svg>
        </div>
        </div>`);

    let img_path = 'https://image.tmdb.org/t/p/w500/';
    el_popup.innerHTML = '<p class="btn-x" id="close-btn"><img src="/image/ic_x.svg" alt=""></p>';

    let res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=be70ce351ebf9cdf3c901d28de3db6a3&append_to_response=videos,images,casts&language=ko-kr`);
    let data = await res.json();

    let resPost = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let dataPost = await resPost.json();

    let resVdo = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let dataVdo = await resVdo.json();

    $('.loader').remove();


    let genres = '';
    data.genres.forEach(function (값, 순번) {
        genres += `<span>${값.name}</span>`;
    })

    //하이라이트반복문
    let videos = '';
    if (data.videos.results.length) {
        data.videos.results.forEach(function (값, 순번) {
            if (순번 < 2) {
                videos += `<p>
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${값.key}"  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </p>`;
            }
        })
    } else {
        dataPost.backdrops.forEach(function (값, 순번) {
            if (순번 < 2) {
                videos += `<p>
                        <img width="100%" height="100%" src="${img_path + 값.file_path}">
                    </p>`;
            }
        });
    }
    //출연진반복분
    let casts = '';
    data.casts.cast.forEach(function (값, 순번) {

        casts += `<li class="act-profi">
                    <p><img src="${img_path + 값.profile_path}" alt=""></p>
                    <b>${값.original_name}</b>
                    <span>${값.character}</span>
            </li>`;

    })

    //관련콘텐츠에 다른 영화 누르면 내용 바뀜
    let etc = '';
    dataVdo.results.forEach(function (값, 순번) {

        etc += `
        
        <a href="" data-href="${값.id}" data-type="영화" class="slide">
        <img src="${img_path + 값.poster_path}" alt="">
        </a>
           `;

    })



    //출력시작~~~~~
    //타이틀
    el_popup.innerHTML += `<div class="title">
            <p class="poster"><img src="${img_path + data.poster_path}" alt=""></p>
            <div class="title-txt">
                <p class="drama">${type}</p>
                <div class="title-span">
                    <b>${data.title}</b>
                    <span>${data.adult ? '19' : '15'}</span>
                    <small>(${data.release_date})</small>
                </div>
                ${data.tagline ? `<p class="text">“${data.tagline}”</p>` : ''}
                <div class="popup-tag">
                    <p>개요</p>
                    <span>${data.origin_country} | </span>
                    <span>${data.runtime}</span>
                    <div class="popup-text">
                        <p>줄거리요약</p>
                        <span>
                            ${data.overview ? data.overview : '줄거리 정보가 제공되지 않습니다.'}
                        </span>
                    </div>
                </div>
                <div class="popup-tag2">
                    <b>${data.vote_average}</b>
                   ${genres}                    
                </div>
                <div class="ott-logo">
                <a href="www.netflix.com/kr"> <img src="/image/ic_netflix.svg" alt=""> </a>
                <a href="www.netflix.com/kr"> <img src="/image/ic_disneyplus.svg" alt=""></a>
                <a href="www.netflix.com/kr"> <img src="/image/ic_tving.svg" alt=""></a>
                <a href="www.netflix.com/kr"> <img src="/image/ic_appleTV.svg" alt=""></a>
                <a href="www.netflix.com/kr"> <img src="/image/ic_wavve.svg" alt=""></a>
            </div>
            </div>          
        </div>`;

    //비디오
    el_popup.innerHTML += `<div class="hig">
            <b>하이라이트</b>
            <div class="hig-img">
                ${videos.length ? videos : '제공되지않습니다.'}                
            </div>
        </div>`;

    //출연진
    //casts.cast[0].profile_path/ character / original_name
    el_popup.innerHTML += `<div class="actor">
            <b>주요 출연진</b>
            <ul class="act">
                ${casts}
            </ul>
        </div>`;

    //관련콘텐츠
    el_popup.innerHTML += `<div class="content-mov">
            <b>관련 콘텐츠</b>
            <div class="mov-img">
                ${etc}
            </div>
        </div>`;



    const popup_wrap = document.querySelector('.popup-wrap');
    const el_xBtn = document.querySelector('.btn-x');

    el_xBtn.addEventListener('click', function () {
        popup_wrap.style = 'display:none';
    });

}



//tv팝업


let popdataFunTv = async function (id, type) {


    const el_popup = document.querySelector('.popup');
    let img_path = 'https://image.tmdb.org/t/p/w500/';
    el_popup.innerHTML = '<p class="btn-x" id="close-btn"><img src="/image/ic_x.svg" alt=""></p>';

    let res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=be70ce351ebf9cdf3c901d28de3db6a3&append_to_response=videos,images,credits&language=ko-kr`);
    let data = await res.json();

    let resVdo = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let dataVdo = await resVdo.json();

    let resImg = await fetch(`https://api.themoviedb.org/3/tv/${id}/images?api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let dataImg = await resImg.json();

    let season = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/1?api_key=be70ce351ebf9cdf3c901d28de3db6a3&append_to_response=videos,images,credits&language=ko-kr`);
    let seaData = await season.json();

    let resRating = await fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let dataRating = await resRating.json();

    console.log(dataRating)


    //연령
    let rating = dataRating.results.filter(function (t) {
        return t.iso_3166_1 == 'KR' || t.iso_3166_1 == 'US';
    })



    //출연진반복분
    let tvCasts = '';

    if (data.credits && data.credits.cast) {

        data.credits.cast.slice(0, 10).forEach(function (c) {
            tvCasts += `
        <li class="act-profi">
            <p><img src="${img_path + c.profile_path}" alt=""></p>
            <b>${c.original_name}</b>
            <span>${c.character}</span>
        </li>`;
        });
    }




    //에피소드반복문    let tvCasts = '';
    console.log(seaData.episodes)
    let tvEpisodes = '';
    if (seaData.episodes && seaData.episodes.length) {
        seaData.episodes.forEach(function (ep) {
            let episodeImg = ep.still_path
                ? `<p><img src="${img_path + ep.still_path}" alt=""></p>`
                : `<p><img src="/image/img_noimage.jpg" alt=""></p>`; // 대체 이미지

            tvEpisodes += `
            <li class="con">
                ${episodeImg}
                <span>${ep.episode_number}</span>
                <div class="con2">
                    <b>${ep.name || '제목 없음'}</b>
                    <p>${ep.overview || '에피소드 정보가 제공되지 않습니다.'}</p>
                </div>
            </li>`;
        });
    } else {
        tvEpisodes = `<li style="color:#999;">에피소드 정보가 없습니다.</li>`;
    }



    //시즌반복문
    let tvSeason = '';
    if (data.seasons) {
        data.seasons.forEach(function (season) {
            if (season.season_number != 0) {
                tvSeason += `
                    <option value="${season.season_number}">
                        Season ${season.season_number}
                    </option>`;
            }
        });
    }


    //별점 반복문
    let tit = '';
    tit += `<b>${data.vote_average}</b>`;
    data.genres.forEach(function (t) {
        tit += `<span>${t.name}</span>`;
    })
    console.log(data)

    // 시즌 클릭시 내용 변경

    // 하이라이트

    let tv_videos = '';
    if (dataVdo.results.length) {
        dataVdo.results.forEach(function (값, 순번) {
            if (순번 < 2) {
                tv_videos += `<p>
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${값.key}"  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </p>`;
            }
        })
    } else {
        dataImg.backdrops.forEach(function (값, 순번) {
            if (순번 < 2) {
                tv_videos += `<p>
                        <img width="100%" height="100%" src="${img_path + 값.file_path}">
                    </p>`;
            }
        });
    }




    //타이틀
    el_popup.innerHTML += `<div class="title">
            <p class="poster"><img src="${img_path + data.poster_path}" alt=""></p>
            <div class="title-txt">
                <p class="drama">${type}</p>
                <div class="title-span">
                <b>${data.name}</b>
                <span>${rating[0].rating}</span>
                <small>${data.first_air_date}</small>
                </div>
                
                <div class="popup-tag">
                <p>개요</p>
                <span>${data.origin_country} | </span>
                <span>${data.number_of_episodes}부작</span>
                <div class="popup-text">
                <p>줄거리요약</p>
                <span>${data.overview}</span>
                </div>
                </div>
                <div class="popup-tag2">
                ${tit}
                
                </div>
                <div class="ott-logo">
                <a href="www.netflix.com/kr"> <img src="./image/ic_netflix.svg" alt=""> </a>
                    <a href="www.netflix.com/kr"> <img src="./image/ic_disneyplus.svg" alt=""></a>
                    <a href="www.netflix.com/kr"> <img src="./image/ic_tving.svg" alt=""></a>
                    <a href="www.netflix.com/kr"> <img src="./image/ic_appleTV.svg" alt=""></a>
                    <a href="www.netflix.com/kr"> <img src="./image/ic_wavve.svg" alt=""></a>
                </div>
                </div>          
        </div>`;

    //비디오
    el_popup.innerHTML += `<div class="hig">
        <b>하이라이트</b>
        <div class="hig-img">${tv_videos}</div>
        </div>`;


    //출연진
    //casts.cast[0].profile_path/ character / original_name
    el_popup.innerHTML += `<div class="actor">
        <b>주요 출연진</b>
        <ul class="act">
        ${tvCasts}
        </ul>`;

    //에피소드
    el_popup.innerHTML += `<div class="episode">
        <div class="solid">
        <b>Episode</b>
        <hr style="margin: 30px 0; border-color: #FF3535; ">
        <select class="tv-option">
            ${tvSeason}
        </select>
        </div>
        <ul>
            ${tvEpisodes}
        </ul>
        </div>`



    const popup_wrap = document.querySelector('.popup-wrap');
    const episode = document.querySelector('.episode ul');
    const tvOption = document.querySelector('.tv-option');
    const el_xBtn = document.querySelector('.btn-x');

    tvOption.addEventListener('change', async function () {
        let value = tvOption.value;
        let season = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${value}?api_key=be70ce351ebf9cdf3c901d28de3db6a3&append_to_response=videos,images,credits&language=ko-kr`);
        let seaData = await season.json();
        let tvEpisodes = '';

        if (seaData.episodes && seaData.episodes.length) {
            seaData.episodes.forEach(function (ep) {
                let episodeImg = ep.still_path
                    ? `<p><img src="${img_path + ep.still_path}" alt=""></p>`
                    : `<p><img src="/image/img_noimage.jpg""></p>`; // 대체 이미지

                tvEpisodes += `
                    <li class="con">
                        ${episodeImg}
                        <span>${ep.episode_number}</span>
                        <div class="con2">
                            <b>${ep.name || '제목 없음'}</b>
                            <p>${ep.overview || '에피소드 정보가 제공되지 않습니다.'}</p>
                        </div>
                    </li>`;
            });
        } else {
            tvEpisodes = `<li style="color:#999;">에피소드 정보가 없습니다.</li>`;
        }

        episode.innerHTML = tvEpisodes;


    })

    el_xBtn.addEventListener('click', function () {
        popup_wrap.style = 'display:none';
    });
}

