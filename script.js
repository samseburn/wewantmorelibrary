// 작은도서관 API 호출 URL
const LIBRARY_URL =
  'http://openapi.seoul.go.kr:8088/6b587a74743930733439484a534456/json/SeoulSmallLibraryInfo/1/1000/';
const LIBRARY_URL2 =
  'http://openapi.seoul.go.kr:8088/6b587a74743930733439484a534456/json/SeoulSmallLibraryInfo/1001/1122/';

// mapbox API KEY
const mapboxToken =
  'pk.eyJ1IjoieW91bmctZGV2IiwiYSI6ImNsYWl4NnVkYzA3MHAzcXA4dndoOTI2MTAifQ.ZjWKFJVkQq8wpcOztRygwQ';
mapboxgl.accessToken = mapboxToken;

// 지도 생성
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/young-dev/claiz4e60000014mtly621egx', // style URL
  center: [127.001699, 37.564214], // 서울 중심 [lng, lat]
  zoom: 11, // zoom +in -out
  projection: 'globe', // display the map as a 3D globe
});

let libraryList = [];

// 1 ~ 1000
fetch(LIBRARY_URL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let datas = data['SeoulSmallLibraryInfo']['row'];

    // 데이터 가져오기
    fetchData(datas);

    // 배열 positions에 입력하기
    let positions = [];
    pushData(libraryList, positions);

    // 처음 로딩 시 전체 마커 띄우기
    setMarker(positions);

    const filterBtns = document.querySelectorAll('.filter-button');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // 클릭 시 기존에 띄워져 있는 데이터 리셋
        resetMarker();
        resetPopup();
        resetList();

        // 해당 구의 도서관 마커 띄우기
        const code = e.currentTarget.dataset.id;
        filterMarker(positions, code);

        // 사이드바 리스트 생성
        const placeholder = document.querySelector('.placeholder');
        makeSidebarList(positions, code);
        placeholder.classList.add('hide');

        // 전체 버튼
        if (code == '전체') {
          setMarker(positions);

          if (placeholder.classList.contains('hide')) {
            placeholder.classList.remove('hide');
          }
        }
      });
    });
  });

// 1001 ~ 1122
fetch(LIBRARY_URL2)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let datas = data['SeoulSmallLibraryInfo']['row'];
    let positions = [];

    // 데이터 가져오기
    fetchData(datas);
    console.log(libraryList); // TEST

    // 배열 positions에 입력하기
    pushData(libraryList, positions);

    // 처음 로딩 시 전체 마커 띄우기
    setMarker(positions);

    // 필터 기능
    const filterBtns = document.querySelectorAll('.filter-button');
    const placeholder = document.querySelector('.placeholder');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // 기존에 띄워져 있는 데이터 리셋
        resetMarker();
        resetPopup();
        resetList();

        // 필터 버튼에 따라 마커 생성
        const code = e.currentTarget.dataset.id;
        filterMarker(positions, code);

        // 사이드바 리스트 생성
        makeSidebarList(positions, code);
        placeholder.classList.add('hide');
        // 전체 버튼
        if (code == '전체') {
          setMarker(positions);

          if (placeholder.classList.contains('hide')) {
            placeholder.classList.remove('hide');
          }
        }
      });
    });
  });

// 데이터 가져오기
function fetchData(obj) {
  obj.forEach((lib) => {
    libraryInfo = {
      libName: lib.LBRRY_NAME,
      libAddr: lib.ADRES,
      libCode: lib.CODE_VALUE,
      libLat: lib.XCNTS,
      libLng: lib.YDNTS,
      libTime: lib.OP_TIME,
    };

    libraryList.push(libraryInfo);
    console.log(libraryInfo.libCode);
  });
}

// 데이터 입력하기
function pushData(obj, arr) {
  obj.forEach((info) => {
    arr.push({
      title: info.libName,
      lat: info.libLat,
      lng: info.libLng,
      address: info.libAddr,
      time: info.libTime,
      code: info.libCode,
    });
  });
}

// 마커 생성하기
function createMarker(arr, i) {
  // create DOM element for the marker
  const el = document.createElement('div');
  el.id = `marker`;
  const lat = arr[i].lat;
  const lng = arr[i].lng;

  // create the popup
  const popup = new mapboxgl.Popup({
    offset: 25,
    className: 'popup',
  })
    .setHTML(
      `
      <div class="popup-header">
      <h1 class="popup-title">${arr[i].title}</h1>
      <span class="popup-code">${arr[i].code}</span>
      </div>
      <p class="popup-desc">
      주소: ${arr[i].address} <br />
      ${arr[i].time} <br />
      </p>
    `
    )
    .setMaxWidth('300px');

  // create the marker
  new mapboxgl.Marker(el)
    .setLngLat([lng, lat])
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);
}

// 전체 마커 띄우기
function setMarker(arr) {
  for (let i = 0; i < arr.length; i++) {
    createMarker(arr, i);
  }
}

// 구별로 마커 띄우기
function filterMarker(arr, code) {
  // marker and popup
  for (let i = 0; i < arr.length; i++) {
    if (code == arr[i].code) {
      createMarker(arr, i);
    }
  }
}

// 마커 지우기
function resetMarker() {
  var markers = document.querySelectorAll('.mapboxgl-marker');
  markers.forEach((marker) => marker.remove());
}

// 마커 색 변화
function changeMarker() {
  var markers = document.querySelectorAll('.mapboxgl-marker');
  markers.forEach((marker) => {
    marker.addEventListener('click', function () {
      console.log(marker.classList);
      marker.classList.toggle('is-active');
    });
  });
}

// 팝업 지우기
function resetPopup() {
  var popups = document.querySelectorAll('.mapboxgl-popup');
  popups.forEach((popup) => popup.remove());
}

// 사이드바 리스트 생성
function makeSidebarList(positions, code) {
  const sidebarList = document.querySelector('.sidebar-list');
  for (let i = 0; i < positions.length; i++) {
    if (code == positions[i].code) {
      const li = document.createElement('li');
      li.classList.add('sidebar-item');
      li.innerHTML = `
        <h3>${positions[i].title}</h3>
        <p>휴관중</p>
        <p><span>주소: </span>${positions[i].address}</p>
        <p><span>운영시간</span>${positions[i].time}</p>
      `;
      sidebarList.append(li);
    }
  }
}

// 사이드바 도서관 리스트 지우기
function resetList() {
  var lis = document.querySelectorAll('.sidebar-item');
  lis.forEach((li) => li.remove());
}
