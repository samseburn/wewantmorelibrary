const mapboxToken =
  'pk.eyJ1IjoieW91bmctZGV2IiwiYSI6ImNsYWl4NnVkYzA3MHAzcXA4dndoOTI2MTAifQ.ZjWKFJVkQq8wpcOztRygwQ';
const LIBRARY_URL =
  'http://openapi.seoul.go.kr:8088/6b587a74743930733439484a534456/json/SeoulSmallLibraryInfo/1/1000/';

mapboxgl.accessToken = mapboxToken;

let libraryList = [];
fetch(LIBRARY_URL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let datas = data['SeoulSmallLibraryInfo']['row'];

    // 데이터 가져오기
    datas.forEach((lib) => {
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

    let positions = [];
    libraryList.forEach((info) => {
      positions.push({
        title: info.libName,
        lat: info.libLat,
        lng: info.libLng,
        address: info.libAddr,
        time: info.libTime,
        code: info.libCode,
      });
    });

    for (let i = 0; i < positions.length; i++) {
      // create DOM element for the marker
      const el = document.createElement('div');
      el.id = `marker`;
      const lat = positions[i].lat;
      const lng = positions[i].lng;

      // create the popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'popup',
      })
        .setHTML(
          `
          <div class="popup-header">
          <h1 class="popup-title">${positions[i].title}</h1>
          <span class="popup-code">${positions[i].code}</span>
          </div>
          <p class="popup-desc">
          주소: ${positions[i].address} <br />
          ${positions[i].time} <br />
          </p>
        `
        )
        .setMaxWidth('500px');

      // create the marker
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
    }

    // @@@
    const filterBtns = document.querySelectorAll('.filter-button');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        resetMarker();
        resetPopup();
        resetList();
        console.log(e.currentTarget.dataset.id);

        const code = e.currentTarget.dataset.id;
        showMap(positions, code);

        // @@@ sidebar content
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

        // @@@ 전체 버튼
        if (code == '전체') {
          for (let i = 0; i < positions.length; i++) {
            // create DOM element for the marker
            const el = document.createElement('div');
            el.id = `marker`;
            const lat = positions[i].lat;
            const lng = positions[i].lng;

            // create the popup
            const popup = new mapboxgl.Popup({
              offset: 25,
              className: 'popup',
            })
              .setHTML(
                `
                <div class="popup-header">
                <h1 class="popup-title">${positions[i].title}</h1>
                <span class="popup-code">${positions[i].code}</span>
                </div>
                <p class="popup-desc">
                주소: ${positions[i].address} <br />
                ${positions[i].time} <br />
                </p>
              `
              )
              .setMaxWidth('500px');

            // create the marker
            new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(popup) // sets a popup on this marker
              .addTo(map);
          }
        }
      });
    });
  });

// Create Map
const map = new mapboxgl.Map({
  container: 'map', // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/young-dev/claiz4e60000014mtly621egx', // style URL
  center: [126.90133964762379, 37.56627700672918], // starting position [lng, lat]
  zoom: 10, // starting zoom
  projection: 'globe', // display the map as a 3D globe
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// 마커 띄우기
function showMap(positions, code) {
  // marker and popup
  for (let i = 0; i < positions.length; i++) {
    if (code == positions[i].code) {
      // create DOM element for the marker
      const el = document.createElement('div');
      el.id = `marker`;
      const lat = positions[i].lat;
      const lng = positions[i].lng;

      // create the popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'popup',
      })
        .setHTML(
          `
            <div class="popup-header">
            <h1 class="popup-title">${positions[i].title}</h1>
            <span class="popup-code">${positions[i].code}</span>
            </div>
            <p class="popup-desc">
            주소: ${positions[i].address} <br />
            운영시간: ${positions[i].time} <br />
            </p>
          `
        )
        .setMaxWidth('500px');

      // create the marker
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
    }
  }
}

// 마커 지우기
function resetMarker() {
  var markers = document.querySelectorAll('.mapboxgl-marker');
  var popup = document.querySelectorAll('.popup');
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

function resetPopup() {
  var popups = document.querySelectorAll('.mapboxgl-popup');

  popups.forEach((popup) => popup.remove());
}

function resetList() {
  var lis = document.querySelectorAll('.sidebar-item');

  lis.forEach((li) => li.remove());
}

changeMarker();
