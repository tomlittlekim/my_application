import {getCurrentUser, isAuthenticated, logout} from '../auth/auth-service.js';

/**
 * 헤더 컴포넌트 초기화 함수
 */
export function initializeHeader() {
  updateHeaderUI();
  setupLogoutButton();
}

/**
 * 사용자 인증 상태에 따라 헤더 UI 업데이트
 */
function updateHeaderUI() {
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  // 사용자 정보 표시 요소
  const userInfo = document.getElementById('userInfo');
  const usernameDisplay = document.getElementById('usernameDisplay');

  // 메뉴 아이템
  const loginMenuItem = document.getElementById('loginMenuItem');
  const registerMenuItem = document.getElementById('registerMenuItem');
  const profileMenuItem = document.getElementById('profileMenuItem');
  const logoutMenuItem = document.getElementById('logoutMenuItem');
  const logoutDivider = document.getElementById('logoutDivider');

  // 관리자 전용 메뉴
  const adminOnlyItems = document.querySelectorAll('.admin-only');

  if (isLoggedIn && currentUser) {
    // 로그인 상태
    userInfo.classList.remove('d-none');
    usernameDisplay.textContent = currentUser.username;

    loginMenuItem.classList.add('d-none');
    registerMenuItem.classList.add('d-none');
    profileMenuItem.classList.remove('d-none');
    logoutMenuItem.classList.remove('d-none');
    logoutDivider.classList.remove('d-none');

    // 관리자인 경우 관리자 메뉴 표시
    if (currentUser.role === 'ADMIN') {
      adminOnlyItems.forEach(item => item.classList.remove('d-none'));
    }
  } else {
    // 로그아웃 상태
    userInfo.classList.add('d-none');

    loginMenuItem.classList.remove('d-none');
    registerMenuItem.classList.remove('d-none');
    profileMenuItem.classList.add('d-none');
    logoutMenuItem.classList.add('d-none');
    logoutDivider.classList.add('d-none');

    // 관리자 메뉴 숨김
    adminOnlyItems.forEach(item => item.classList.add('d-none'));
  }
}

/**
 * 로그아웃 버튼 이벤트 설정
 */
function setupLogoutButton() {
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

/**
 * 로그아웃 처리 함수
 */
async function handleLogout() {
  try {
    // 로그아웃 함수 호출 (auth-service.js에 정의됨)
    await logout();

    // 토큰 및 사용자 정보 삭제
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');

    // 로그인 페이지로 리다이렉트
    window.location.href = '/fragments/auth/login.html';

    // 성공 메시지
    console.log('로그아웃되었습니다.');
  } catch (error) {
    console.error('로그아웃 처리 중 오류가 발생했습니다:', error);
    alert('로그아웃 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}