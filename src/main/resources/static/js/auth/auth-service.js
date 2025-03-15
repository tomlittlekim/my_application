/**
 * GraphQL을 사용한 인증 서비스 모듈
 */
export async function login(username, password) {
  const mutation = `
    mutation {
      login(username: "${username}", password: "${password}") {
        success
        token
        message
        user {
          id
          username
          email
          role
        }
      }
    }
  `;

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const result = await response.json();

    // GraphQL 오류 처리
    if (result.errors) {
      return {
        success: false,
        message: result.errors[0].message
      };
    }

    return result.data.login;
  } catch (error) {
    console.error(`로그인 요청 실패:`, error);
    throw error;
  }
}

export async function register(username, email, password) {
  const mutation = `
    mutation {
      register(username: "${username}", email: "${email}", password: "${password}") {
        success
        message
        user {
          id
          username
          email
        }
      }
    }
  `;

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation }),
    });

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const result = await response.json();

    // GraphQL 오류 처리
    if (result.errors) {
      return {
        success: false,
        message: result.errors[0].message
      };
    }

    return result.data.register;
  } catch (error) {
    console.error(`회원가입 요청 실패:`, error);
    throw error;
  }
}

/**
 * 로그아웃 처리
 * 서버 측 세션이 없으므로 클라이언트에서 토큰 삭제
 */
export async function logout() {
  try {
    // 클라이언트 스토리지에서 인증 정보 제거
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');

    // 필요한 경우 서버에 로그아웃 요청을 보낼 수 있음
    // 예: 토큰 블랙리스트에 추가하거나 기타 서버 측 정리 작업
    const mutation = `
      mutation {
        logout {
          success
          message
        }
      }
    `;

    // JWT 토큰이 있으면 서버에 로그아웃 요청
    const token = localStorage.getItem('authToken');
    if (token) {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: mutation }),
      });

      // 응답을 처리할 필요는 없음 - 클라이언트 측 로그아웃은 이미 완료됨
    }

    return true;
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error);
    // 오류가 발생하더라도 클라이언트 측 로그아웃은 완료됨
    return true;
  }
}

/**
 * 현재 사용자의 인증 상태를 확인
 * @returns {boolean} 인증 여부
 */
export function isAuthenticated() {
  return localStorage.getItem('authToken') !== null;
}

/**
 * 현재 로그인한 사용자 정보 조회
 * @returns {Object|null} 사용자 정보 객체 또는 null
 */
export function getCurrentUser() {
  const userJson = sessionStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * GraphQL 요청에 인증 토큰을 포함하는 함수
 * @param {Object} options - Fetch API 옵션
 * @returns {Object} 인증 헤더가 추가된 옵션
 */
export function addAuthHeader(options = {}) {
  const token = localStorage.getItem('authToken');

  if (!token) return options;

  return {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };
}