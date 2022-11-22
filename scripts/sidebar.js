// 사이드바 토글 기능
const sidebar = document.querySelector('.sidebar');
const sidebarOpenBtn = document.querySelector('.sidebar-open-button');
sidebarOpenBtn.addEventListener('click', function (e) {
  const span = sidebarOpenBtn.firstElementChild;
  span.classList.toggle('is-active');
  sidebar.classList.toggle('is-active');
});
