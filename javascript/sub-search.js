// 🎨 장르 데이터 가져오기
fetch('https://api.themoviedb.org/3/genre/movie/list?language=ko-KR&api_key=f89a6c1f22aca3858a4ae7aef10de967')
    .then(res => res.json())
    .then(function (data) {
        localStorage.genres = JSON.stringify(data.genres);
    });

const img_path = 'https://image.tmdb.org/t/p/w300';
const genres = JSON.parse(localStorage.genres);
let datasets = [];

// 🕵️‍♂️ 영화/TV 검색 함수
let searchFun = async function (keyword) {
    // 영화 검색
    let res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${keyword}&api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let movieData = await res.json();
    
    // TV 검색
    let res2 = await fetch(`https://api.themoviedb.org/3/search/tv?query=${keyword}&api_key=be70ce351ebf9cdf3c901d28de3db6a3`);
    let tvData = await res2.json();
    
    let res3 = await fetch(`https://api.themoviedb.org/3/search/person?api_key=be70ce351ebf9cdf3c901d28de3db6a3&query=${keyword}&language=ko-KR`);
    let personData = await res3.json();

    datasets = [
        {type: '영화', cName:['movie','searchList'], data: movieData.results},
        {type: 'TV프로그램', cName:['tv','searchList'], data: tvData.results},
        {type: '인물', cName:['person','searchH'], data: personData.results}
    ];

    datasets.sort(function(a,b){
        return b.data.length - a.data.length; // 내림차순
    });
    
    
    // DOM 출력
    domContral(datasets);
}

// 🎬 DOM 출력 함수
let domContral = function(datasets) {
    const search_wrap = document.querySelector('.search-wrap');
    const searchAll = document.querySelectorAll('.data-list');
    const scMenu = document.querySelector('.scMenu');
    
    
    //초기화
    if(searchAll.length){
        searchAll.forEach((element)=>element.remove());
    }
    scMenu.innerHTML='';

    scMenu.innerHTML += `<button class="active">전체(${datasets[0].data.length + datasets[1].data.length + datasets[2].data.length })</button>`;

    
    // 📌 화면 출력
    datasets.forEach(function(obj,i){

        scMenu.innerHTML += `<button>${obj.type}(${obj.data.length})</button>`;
        search_wrap.innerHTML +=`
            <div class="searchAll ${obj.cName[0]} data-list">
                <div class="search">
                    <b>${obj.type} 검색결과(${obj.data.length})</b>
                </div>
                <div class="${obj.cName[1]}">
                    ${output(obj)}
                </div>
            </div>`;
    });

    searchTab();

}
let output = function (obj) {
    
    const activeBtn = document.querySelector('.scMenu button.active');
    if (activeBtn.textContent.startsWith('전체')) {
        return output8(obj);
    } else {
        return output20(obj);
    }
};

let output8 = function (obj) {
    return obj.data.slice(0,8).map(function(item){
                let genre = [];
                if(item.genre_ids){
                    genres.forEach(function(g){
                        if(item.genre_ids.includes(g.id)){
                            genre.push(g.name);
                        }
                    });
                }
                switch(obj.type){
                    case '영화':
                    return `
                        <figure>
                            <img src="${item.poster_path ? img_path + item.poster_path : '../image/no_img.jpg'}" alt="">
                            <figcaption>
                                <b>${item.original_title}</b>
                                <p>${item.release_date ? item.release_date.split('-')[0] : 'N/A'} · ${genre.slice(0,2).join('/')}</p>
                                <p>${item.vote_average.toFixed(1)}</p>
                            </figcaption>
                        </figure>
                    `;
                    case 'TV프로그램':
                    return `
                        <figure>
                            <img src="${item.poster_path ? img_path + item.poster_path : '../image/no_img.jpg'}" alt="">
                            <figcaption>
                                <b>${item.original_name}</b>
                                <p>${item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'} · ${genre.slice(0,2).join('/')}</p>
                                <p>${item.vote_average.toFixed(1)}</p>
                            </figcaption>
                        </figure>
                    `;                        
                    default:
                    return `
                        <figure>
                            <img src="${item.profile_path ? img_path + item.profile_path : '../image/no_img.jpg'}" alt="">
                            <p>${item.name}</p>
                        </figure>
                    `;
                }
                
            }).join('')
};
let output20 = function (obj) {
    console.log(obj)
    return obj.data.map(function(item){
                let genre = [];
                if(item.genre_ids){
                    genres.forEach(function(g){
                        if(item.genre_ids.includes(g.id)){
                            genre.push(g.name);
                        }
                    });
                }
                switch(obj.type){
                    case '영화':
                    return `
                        <figure>
                            <img src="${item.poster_path ? img_path + item.poster_path : '../image/no_img.jpg'}" alt="">
                            <figcaption>
                                <b>${item.original_title}</b>
                                <p>${item.release_date ? item.release_date.split('-')[0] : 'N/A'} · ${genre.slice(0,2).join('/')}</p>
                                <p>${item.vote_average.toFixed(1)}</p>
                            </figcaption>
                        </figure>
                    `;
                    case 'TV프로그램':
                    return `
                        <figure>
                            <img src="${item.poster_path ? img_path + item.poster_path : '../image/no_img.jpg'}" alt="">
                            <figcaption>
                                <b>${item.original_name}</b>
                                <p>${item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'} · ${genre.slice(0,2).join('/')}</p>
                                <p>${item.vote_average.toFixed(1)}</p>
                            </figcaption>
                        </figure>
                    `;                        
                    default:
                    return `
                        <figure>
                            <img src="${item.profile_path ? img_path + item.profile_path : '../image/no_img.jpg'}" alt="">
                            <p>${item.name}</p>
                        </figure>
                    `;
                }
                
            }).join('')
};

// 🔍 검색 input + form 이벤트
let searchEvent = function(){
    const el_form = document.querySelector('.header-search-box');
    const el_input = document.querySelector('.header-search-box input');
    const el_searchTitle = document.querySelector('.scMain h3');
    
    el_form.addEventListener('submit', function(e){
        e.preventDefault(); // 검색하면 기본으로 동작되는 '새로고침'을 막음 (이거 안하면 검색하면 새로고침되서 데이터)
        searchFun(el_input.value.trim());
        el_searchTitle.innerText = `"${el_input.value}" 검색결과`;
    });
}

// 💡 메뉴 버튼 클릭 이벤트

let searchTab = function(){

    const scMenu = document.querySelector('.scMenu');
    
    
    scMenu.addEventListener('click', function(e){
        
        const search_wrap = document.querySelector('.search-wrap');
        const searchListM = document.querySelector('.movie .searchList');
        const searchListT = document.querySelector('.tv .searchList');
        const searchH = document.querySelector('.searchH');
        const btn = e.target.closest('button'); // 버튼인지 확인
        
        if(!btn) return;
    
        // 모든 버튼에서 active 제거
        scMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    
        // 클릭한 버튼에만 active 추가
        btn.classList.add('active');

        
        // 버튼별 화면 표시
        const text = btn.textContent;
        
        
        if(text.startsWith('전체')) {
            search_wrap.querySelectorAll('.searchAll').forEach(el => el.style.display = 'block');
            domContral(datasets);
            searchListM.style='';
            searchListT.style='';
            searchH.style='';
            
        } else if(text.includes('영화')) {
            search_wrap.querySelectorAll('.searchAll').forEach(el => el.style.display = el.classList.contains('movie') ? 'block' : 'none');
            let d = datasets.filter((obj)=>obj.type=='영화');
            searchListM.style='flex-wrap:wrap';
            searchListM.innerHTML = output(...d);
        } else if(text.includes('TV프로그램')) {
            search_wrap.querySelectorAll('.searchAll').forEach(el => el.style.display = el.classList.contains('tv') ? 'block' : 'none');
            let d = datasets.filter((obj)=>obj.type=='TV프로그램');
            searchListT.style='flex-wrap:wrap';
            searchListT.innerHTML = output(...d);
        } else if(text.includes('인물')) {
            search_wrap.querySelectorAll('.searchAll').forEach(el => el.style.display = el.classList.contains('person') ? 'block' : 'none');
            let d = datasets.filter((obj)=>obj.type=='인물');
            searchH.style='flex-wrap:wrap';
            searchH.innerHTML = output(...d);
        }
    });
}



searchEvent();



