import {register} from './auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registerAlert = document.getElementById('registerAlert');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 에러 메시지 초기화
    registerAlert.classList.add('d-none');

    // 폼 데이터 수집
    const username = registerForm.username.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirmPassword.value;
    const termsAccepted = registerForm.termsAccepted.checked;

    // 기본 유효성 검사
    if (!validateInputs(username, email, password, confirmPassword, termsAccepted)) {
      return;
    }

    try {
      // 회원가입 요청
      const result = await register(username, email, password);

      if (result.success) {
        // 회원가입 성공
        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        window.location.href = '/fragments/auth/login.html';
      } else {
        // 회원가입 실패
        showError(result.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      showError('서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  });

  // 비밀번호 확인 실시간 검증
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
    } else {
      confirmPasswordInput.setCustomValidity('');
    }
  });

  // 아이디 유효성 검사 (영문, 숫자 조합)
  const usernameInput = document.getElementById('username');
  usernameInput.addEventListener('input', () => {
    const value = usernameInput.value;
    const isValid = /^[a-zA-Z0-9]{4,20}$/.test(value);

    if (!isValid) {
      usernameInput.setCustomValidity('아이디는 4-20자 이내의 영문, 숫자 조합이어야 합니다.');
    } else {
      usernameInput.setCustomValidity('');
    }
  });

  // 비밀번호 유효성 검사 (최소 8자, 영문, 숫자, 특수문자 조합)
  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);

    if (!isValid) {
      passwordInput.setCustomValidity('비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자 조합이어야 합니다.');
    } else {
      passwordInput.setCustomValidity('');
    }
  });
});

/**
 * 사용자 입력 유효성 검사
 */
function validateInputs(username, email, password, confirmPassword, termsAccepted) {
  // 아이디 검사
  if (!/^[a-zA-Z0-9]{4,20}$/.test(username)) {
    showError('아이디는 4-20자 이내의 영문, 숫자 조합이어야 합니다.');
    return false;
  }

  // 이메일 검사
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showError('유효한 이메일 주소를 입력해주세요.');
    return false;
  }

  // 비밀번호 검사
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
    showError('비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자 조합이어야 합니다.');
    return false;
  }

  // 비밀번호 일치 검사
  if (password !== confirmPassword) {
    showError('비밀번호가 일치하지 않습니다.');
    return false;
  }

  // 약관 동의 검사
  if (!termsAccepted) {
    showError('이용약관 및 개인정보 처리방침에 동의해주세요.');
    return false;
  }

  return true;
}

/**
 * 오류 메시지 표시
 */
function showError(message) {
  const registerAlert = document.getElementById('registerAlert');
  registerAlert.textContent = message;
  registerAlert.classList.remove('d-none');
}