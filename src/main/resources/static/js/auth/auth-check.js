/**
 * 페이지 보호를 위한 인증 체크 스크립트
 * 로그인 없이 접근 불가능한 페이지에 포함시킴
 */

import {isAuthenticated} from './auth-service.js';

// 페이지 로드 시 인증 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
  if (!isAuthenticated()) {
    // 현재 URL을 저장하여 로그인 후 원래 페이지로 돌아올 수 있게 함
    const currentPage = window.location.href;
    sessionStorage.setItem('redirectAfterLogin', currentPage);

    // 로그인 페이지로 이동
    window.location.href = '/fragments/auth/login.html';
  }
});