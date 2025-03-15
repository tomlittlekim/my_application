import {getCurrentUser} from './auth-service.js';
import {fetchUserActivities, formatActivity} from './activity-fetcher.js';

/**
 * 사용자 프로필 페이지 렌더링
 */
export function renderUserProfile() {
  // 현재 사용자 정보 가져오기
  const currentUser = getCurrentUser();

  if (!currentUser) {
    // 사용자 정보가 없으면 로그인 페이지로 리디렉션
    window.location.href = '/fragments/auth/login.html';
    return;
  }

  // 프로필 카드 정보 업데이트
  updateProfileCard(currentUser);

  // 사용자 정보 표시
  displayUserInfo(currentUser);

  // 정보 수정 관련 이벤트 설정
  setupInfoEditEvents(currentUser);

  // 비밀번호 변경 폼 이벤트 설정
  setupPasswordChangeForm();

  // 비밀번호 강도 측정 이벤트 설정
  setupPasswordStrengthMeter();

  // 사용자 활동 내역 로드
  loadUserActivities();

  // 환경설정 폼 이벤트 설정
  setupPreferencesForm();

  // 탭 변경 이벤트 처리
  setupTabEvents();
}

/**
 * 사용자 활동 내역 로드
 */
async function loadUserActivities() {
  const activityList = document.getElementById('activityList');

  // 로딩 표시
  activityList.innerHTML = `
    <li class="list-group-item d-flex justify-content-center align-items-center bg-light py-3">
      <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
        <span class="visually-hidden">로딩 중...</span>
      </div>
      <span>활동 내역을 불러오는 중...</span>
    </li>
  `;

  // 서버에서 활동 내역 가져오기
  const activities = await fetchUserActivities(15);

  // 활동 내역이 없는 경우
  if (!activities || activities.length === 0) {
    activityList.innerHTML = `
      <li class="list-group-item text-center">
        <p class="text-muted my-2">활동 내역이 없습니다.</p>
      </li>
    `;
    return;
  }

  // 활동 내역 표시
  let activityHTML = '';
  activities.forEach(activity => {
    const { icon, message } = formatActivity(activity);
    const timestamp = new Date(activity.timestamp);
    const timeAgo = getTimeAgo(timestamp);

    activityHTML += `
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <i class="${icon} me-2"></i>
            <span>${message}</span>
          </div>
          <small class="text-muted">${timeAgo}</small>
        </div>
      </li>
    `;
  });

  activityList.innerHTML = activityHTML;
}

/**
 * 프로필 카드 정보 업데이트
 */
function updateProfileCard(user) {
  // 프로필 아바타 이니셜 설정
  const initialElement = document.getElementById('avatarInitial');
  if (initialElement) {
    initialElement.textContent = user.username.charAt(0).toUpperCase();
  }

  // 사용자명 설정
  const usernameElement = document.getElementById('profileUsername');
  if (usernameElement) {
    usernameElement.textContent = user.username;
  }

  // 역할 설정
  const roleElement = document.getElementById('profileRole');
  if (roleElement) {
    roleElement.textContent = formatUserRole(user.role);
  }

  // 이메일 설정
  const emailElement = document.getElementById('profileEmail');
  if (emailElement) {
    emailElement.textContent = user.email;
  }

  // 가입일 설정
  const joinDateElement = document.getElementById('profileJoinDate');
  if (joinDateElement && user.createdAt) {
    const createdAtDate = new Date(user.createdAt);
    joinDateElement.textContent = `가입일: ${formatDate(createdAtDate)}`;
  }
}

/**
 * 사용자 정보 표시
 */
function displayUserInfo(user) {
  // 조회 모드 필드 업데이트
  document.getElementById('viewUsername').textContent = user.username;
  document.getElementById('viewEmail').textContent = user.email;
  document.getElementById('viewRole').textContent = formatUserRole(user.role);

  // 가입일 포맷팅
  const createdAtDate = new Date(user.createdAt);
  document.getElementById('viewJoinDate').textContent = formatDate(createdAtDate);

  // 최근 로그인 정보 (있는 경우)
  if (user.lastLoginAt) {
    const lastLoginDate = new Date(user.lastLoginAt);
    document.getElementById('viewLastLogin').textContent = formatDate(lastLoginDate);
  } else {
    document.getElementById('viewLastLogin').textContent = '정보 없음';
  }

  // 수정 모드 필드 업데이트
  document.getElementById('username').value = user.username;
  document.getElementById('email').value = user.email;
}

/**
 * 정보 수정 관련 이벤트 설정
 */
function setupInfoEditEvents(user) {
  const editInfoBtn = document.getElementById('editInfoBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const viewInfo = document.getElementById('viewInfo');
  const editInfo = document.getElementById('editInfo');
  const profileForm = document.getElementById('profileForm');
  const infoAlert = document.getElementById('infoAlert');

  // 수정 버튼 클릭
  editInfoBtn.addEventListener('click', () => {
    viewInfo.classList.add('d-none');
    editInfo.classList.remove('d-none');
  });

  // 취소 버튼 클릭
  cancelEditBtn.addEventListener('click', () => {
    // 원래 값으로 되돌리기
    document.getElementById('email').value = user.email;

    // 보기 모드로 전환
    viewInfo.classList.remove('d-none');
    editInfo.classList.add('d-none');

    // 알림 숨기기
    infoAlert.classList.add('d-none');
  });

  // 프로필 폼 제출
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();

    try {
      // GraphQL 사용자 정보 업데이트 뮤테이션 호출
      const mutation = `
        mutation {
          updateUser(email: "${email}") {
            success
            message
            user {
              id
              username
              email
              role
              createdAt
            }
          }
        }
      `;

      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ query: mutation })
      });

      const result = await response.json();

      if (result.data && result.data.updateUser.success) {
        // 성공 메시지 표시
        infoAlert.textContent = result.data.updateUser.message;
        infoAlert.classList.remove('alert-danger');
        infoAlert.classList.add('alert-success');
        infoAlert.classList.remove('d-none');

        // 세션 스토리지의 사용자 정보 업데이트
        const updatedUser = result.data.updateUser.user;
        const currentUser = getCurrentUser();

        if (currentUser && updatedUser) {
          const updatedCurrentUser = {
            ...currentUser,
            email: updatedUser.email
          };

          sessionStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        }

        // UI 업데이트
        user.email = email;
        displayUserInfo(user);
        updateProfileCard(user);

        // 보기 모드로 전환
        viewInfo.classList.remove('d-none');
        editInfo.classList.add('d-none');
      } else {
        // 오류 메시지 표시
        const errorMessage = result.data?.updateUser.message || '정보 업데이트 중 오류가 발생했습니다.';
        infoAlert.textContent = errorMessage;
        infoAlert.classList.remove('alert-success');
        infoAlert.classList.add('alert-danger');
        infoAlert.classList.remove('d-none');
      }
    } catch (error) {
      console.error('정보 업데이트 오류:', error);
      infoAlert.textContent = '서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      infoAlert.classList.remove('alert-success');
      infoAlert.classList.add('alert-danger');
      infoAlert.classList.remove('d-none');
    }
  });
}

/**
 * 비밀번호 변경 폼 이벤트 설정
 */
function setupPasswordChangeForm() {
  const passwordChangeForm = document.getElementById('passwordChangeForm');
  const passwordAlert = document.getElementById('passwordAlert');

  if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 알림 메시지 초기화
      passwordAlert.classList.add('d-none');

      // 폼 데이터 가져오기
      const currentPassword = passwordChangeForm.currentPassword.value;
      const newPassword = passwordChangeForm.newPassword.value;
      const confirmPassword = passwordChangeForm.confirmPassword.value;

      // 새 비밀번호 일치 확인
      if (newPassword !== confirmPassword) {
        showPasswordChangeError('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      // 비밀번호 복잡성 검사
      if (!isPasswordComplex(newPassword)) {
        showPasswordChangeError('비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자 조합이어야 합니다.');
        return;
      }

      try {
        // GraphQL 비밀번호 변경 뮤테이션 호출
        const mutation = `
          mutation {
            changePassword(oldPassword: "${currentPassword}", newPassword: "${newPassword}") {
              success
              message
            }
          }
        `;

        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ query: mutation })
        });

        const result = await response.json();

        if (result.data && result.data.changePassword.success) {
          // 성공 메시지 표시
          passwordAlert.textContent = '비밀번호가 성공적으로 변경되었습니다.';
          passwordAlert.classList.remove('alert-danger');
          passwordAlert.classList.add('alert-success');
          passwordAlert.classList.remove('d-none');
          passwordChangeForm.reset();
        } else {
          // 오류 메시지 표시
          const errorMessage = result.data?.changePassword.message || '비밀번호 변경 중 오류가 발생했습니다.';
          showPasswordChangeError(errorMessage);
        }
      } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        showPasswordChangeError('서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    });

    // 비밀번호 확인 실시간 검증
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    confirmPasswordInput.addEventListener('input', () => {
      if (newPasswordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
      } else {
        confirmPasswordInput.setCustomValidity('');
      }
    });

    // 새 비밀번호 유효성 검사
    newPasswordInput.addEventListener('input', () => {
      if (!isPasswordComplex(newPasswordInput.value)) {
        newPasswordInput.setCustomValidity('비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자 조합이어야 합니다.');
      } else {
        newPasswordInput.setCustomValidity('');
      }
    });
  }
}

/**
 * 비밀번호 강도 측정 설정
 */
function setupPasswordStrengthMeter() {
  const newPasswordInput = document.getElementById('newPassword');
  const strengthBar = document.getElementById('passwordStrength');

  newPasswordInput.addEventListener('input', () => {
    const password = newPasswordInput.value;
    const strength = calculatePasswordStrength(password);

    // 강도에 따라 색상 변경
    let color = 'danger';
    if (strength > 70) color = 'success';
    else if (strength > 40) color = 'warning';

    // 프로그레스 바 업데이트
    strengthBar.style.width = `${strength}%`;
    strengthBar.setAttribute('aria-valuenow', strength);

    // 색상 클래스 설정
    strengthBar.className = `progress-bar bg-${color}`;
  });
}

/**
 * 비밀번호 강도 계산 (0-100)
 */
function calculatePasswordStrength(password) {
  if (!password) return 0;

  let strength = 0;

  // 길이 점수 (최대 30점)
  strength += Math.min(30, Math.floor(password.length * 3));

  // 다양성 점수
  if (/[a-z]/.test(password)) strength += 10; // 소문자
  if (/[A-Z]/.test(password)) strength += 10; // 대문자
  if (/[0-9]/.test(password)) strength += 10; // 숫자
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15; // 특수문자

  // 문자 다양성 점수 (최대 25점)
  const uniqueChars = new Set(password).size;
  strength += Math.min(25, uniqueChars * 2);

  return Math.min(100, strength);
}

/**
 * 비밀번호 변경 오류 메시지 표시
 */
function showPasswordChangeError(message) {
  const passwordAlert = document.getElementById('passwordAlert');
  passwordAlert.textContent = message;
  passwordAlert.classList.remove('alert-success');
  passwordAlert.classList.add('alert-danger');
  passwordAlert.classList.remove('d-none');
}

/**
 * 사용자 활동 내역 로드
 */
async function loadActivityHistory() {
  const activityList = document.getElementById('activityList');

  // 샘플 활동 데이터 (실제로는 서버에서 가져와야 함)
  const activities = [
    { type: 'login', timestamp: new Date(Date.now() - 1000 * 60 * 5), message: '로그인' },
    { type: 'profile_update', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), message: '프로필 정보 변경' },
    { type: 'password_change', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), message: '비밀번호 변경' },
    { type: 'content_add', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), message: '영화 추가: "인셉션"' },
    { type: 'content_edit', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), message: '영화 편집: "매트릭스"' }
  ];

  // 활동 내역이 없는 경우
  if (activities.length === 0) {
    activityList.innerHTML = `
      <li class="list-group-item text-center">
        <p class="text-muted my-2">활동 내역이 없습니다.</p>
      </li>
    `;
    return;
  }

  // 활동 내역 표시
  let activityHTML = '';
  activities.forEach(activity => {
    const iconClass = getActivityIcon(activity.type);
    const timeAgo = getTimeAgo(activity.timestamp);

    activityHTML += `
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <i class="${iconClass} me-2"></i>
            <span>${activity.message}</span>
          </div>
          <small class="text-muted">${timeAgo}</small>
        </div>
      </li>
    `;
  });

  activityList.innerHTML = activityHTML;
}

/**
 * 활동 타입에 따른 아이콘 클래스 반환
 */
function getActivityIcon(type) {
  switch (type) {
    case 'login': return 'bi bi-box-arrow-in-right';
    case 'profile_update': return 'bi bi-person-gear';
    case 'password_change': return 'bi bi-shield-lock';
    case 'content_add': return 'bi bi-plus-circle';
    case 'content_edit': return 'bi bi-pencil-square';
    default: return 'bi bi-activity';
  }
}

/**
 * 환경설정 폼 이벤트 설정
 */
function setupPreferencesForm() {
  const preferencesForm = document.getElementById('preferencesForm');

  // 저장된 설정 불러오기
  loadSavedPreferences();

  // 설정 저장
  preferencesForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 테마 설정
    const theme = document.querySelector('input[name="theme"]:checked').value;

    // 알림 설정
    const emailNotification = document.getElementById('emailNotification').checked;
    const loginNotification = document.getElementById('loginNotification').checked;

    // 설정 저장
    const preferences = {
      theme,
      notifications: {
        email: emailNotification,
        login: loginNotification
      }
    };

    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    // 테마 적용
    applyTheme(theme);

    // 성공 메시지 표시
    alert('설정이 저장되었습니다.');
  });
}

/**
 * 저장된 환경설정 불러오기
 */
function loadSavedPreferences() {
  const preferencesJson = localStorage.getItem('userPreferences');

  if (preferencesJson) {
    const preferences = JSON.parse(preferencesJson);

    // 테마 설정
    const themeInput = document.querySelector(`input[name="theme"][value="${preferences.theme}"]`);
    if (themeInput) themeInput.checked = true;

    // 알림 설정
    if (preferences.notifications) {
      document.getElementById('emailNotification').checked = preferences.notifications.email;
      document.getElementById('loginNotification').checked = preferences.notifications.login;
    }

    // 테마 적용
    applyTheme(preferences.theme);
  }
}

/**
 * 테마 적용
 */
function applyTheme(theme) {
  const body = document.body;

  // 기존 테마 클래스 제거
  body.classList.remove('theme-light', 'theme-dark');

  // 시스템 설정 사용 시
  if (theme === 'system') {
    // 시스템 다크 모드 감지
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
  } else {
    // 직접 선택한 테마 적용
    body.classList.add(`theme-${theme}`);
  }
}

/**
 * 사용자 권한 한글화
 */
function formatUserRole(role) {
  switch (role) {
    case 'ADMIN':
      return '관리자';
    case 'USER':
      return '일반 사용자';
    default:
      return role;
  }
}

/**
 * 날짜 포맷팅
 */
function formatDate(date) {
  if (!date) return '정보 없음';

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * 얼마나 지났는지 표시 (예: "5분 전", "2시간 전")
 */
function getTimeAgo(timestamp) {
  const now = new Date();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return '방금 전';
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHr < 24) {
    return `${diffHr}시간 전`;
  } else if (diffDay < 7) {
    return `${diffDay}일 전`;
  } else {
    return formatDate(timestamp);
  }
}

/**
 * 비밀번호 복잡성 검사
 */
function isPasswordComplex(password) {
  // 최소 8자, 영문, 숫자, 특수문자 포함 검사
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
}

/**
 * 탭 변경 이벤트 설정
 */
function setupTabEvents() {
  // URL 해시에 따라 탭 활성화
  const hash = window.location.hash.substring(1);
  if (hash) {
    const tab = document.querySelector(`a[href="#${hash}"]`);
    if (tab) {
      tab.click();
    }
  }

  // 탭 변경 시 URL 해시 업데이트
  const tabLinks = document.querySelectorAll('.list-group-item[data-bs-toggle="list"]');
  tabLinks.forEach(link => {
    link.addEventListener('shown.bs.tab', (e) => {
      const id = e.target.getAttribute('href').substring(1);
      window.location.hash = id;
    });
  });
}