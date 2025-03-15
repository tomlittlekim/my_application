import {login} from './auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');

  // 이전에 저장된 로그인 정보가 있는지 확인
  const savedUsername = localStorage.getItem('savedUsername');
  if (savedUsername) {
    document.getElementById('username').value = savedUsername;
    document.getElementById('rememberMe').checked = true;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 로그인 실패 알림 숨기기
    loginAlert.classList.add('d-none');

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;
    const rememberMe = loginForm.rememberMe.checked;

    try {
      // 로그인 시도
      const loginResult = await login(username, password);

      if (loginResult.success) {
        // 로그인 성공

        // 'Remember Me' 체크되어 있다면 사용자 이름 저장
        if (rememberMe) {
          localStorage.setItem('savedUsername', username);
        } else {
          localStorage.removeItem('savedUsername');
        }

        // JWT 토큰 저장
        localStorage.setItem('authToken', loginResult.token);

        // 사용자 정보 저장
        sessionStorage.setItem('currentUser', JSON.stringify(loginResult.user));

        // 저장된 리디렉션 URL이 있는 경우 해당 페이지로 이동, 없으면 메인 페이지로 이동
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin'); // 리디렉션 URL 삭제
        window.location.href = redirectUrl;
      } else {
        // 로그인 실패
        loginAlert.classList.remove('d-none');
        loginAlert.textContent = loginResult.message || '로그인 실패! 아이디와 비밀번호를 확인해주세요.';
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      loginAlert.classList.remove('d-none');
      loginAlert.textContent = '서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  });
});