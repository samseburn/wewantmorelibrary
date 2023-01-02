/* eslint-disable */

// 필터 버튼 기능
const filterCategoryBtns = document.querySelectorAll('.filter-category-item');
const all = document.querySelector('.all');
const guList = document.querySelector('.gu-list');
const filterBtnList = document.querySelector('.filter-list');
const filterBtns = document.querySelectorAll('.filter-item');
const placeholder = document.querySelector('.placeholder');

// 전체
all.addEventListener('click', function (e) {
  switchBtn(guList);
  all.classList.toggle('is-active');
  if (all.classList.contains('is-active')) {
    filterBtnList.classList.remove('is-shown');
  }
});

// 구별보기
guList.addEventListener('click', function (e) {
  removeClass(filterBtns);
  switchBtn(all);
  guList.classList.toggle('is-active');

  if (!guList.classList.contains('is-active')) {
    filterBtnList.classList.remove('is-shown');
    placeholder.classList.remove('hide');
  } else {
    filterBtnList.classList.toggle('is-shown');
  }
});

filterBtns.forEach((button) => {
  button.addEventListener('click', function (e) {
    removeClass(filterBtns);
    button.classList.toggle('is-active');
  });
});

function removeClass(btns) {
  btns.forEach((button) => {
    if (button.classList.contains('is-active')) {
      button.classList.remove('is-active');
    }
    // console.log(button);
  });
}

function switchBtn(btn) {
  if (btn.classList.contains('is-active')) {
    btn.classList.remove('is-active');
  }
}
