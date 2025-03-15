/**
 * JWT 토큰 관련 유틸리티 함수
 */

/**
 * JWT 토큰 파싱
 * @param {string} token - JWT 토큰 문자열
 * @returns {Object|null} 파싱된 JWT 페이로드 또는 파싱 실패 시 null
 */
export function parseJwt(token) {
  try {
    // Base64Url 디코딩
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // 디코딩된 문자열을 JSON으로 파싱
    const jsonPayload = decodeURIComponent(
        atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 토큰 파싱 오류:', error);
    return null;
  }
}

/**
 * JWT 토큰 만료 확인
 * @param {string} token - JWT 토큰 문자열
 * @returns {boolean} 토큰이 만료되었으면 true, 아니면 false
 */
export function isTokenExpired(token) {
  const payload = parseJwt(token);

  if (!payload || !payload.exp) {
    return true; // 파싱 실패 또는 exp가 없으면 만료된 것으로 간주
  }

  // 현재 시간과 토큰 만료 시간 비교 (초 단위)
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * JWT 토큰이 유효한지 확인
 * @param {string} token - JWT 토큰 문자열
 * @returns {boolean} 토큰이 유효하면 true, 아니면 false
 */
export function isValidToken(token) {
  if (!token) {
    return false;
  }

  // 토큰 형식 검사 (간단한 검사)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    return false;
  }

  // 만료 여부 확인
  return !isTokenExpired(token);
}

/**
 * 토큰에서 사용자 ID 추출
 * @param {string} token - JWT 토큰 문자열
 * @returns {string|null} 사용자 ID 또는 추출 실패 시 null
 */
export function getUserIdFromToken(token) {
  const payload = parseJwt(token);

  if (!payload || !payload.sub) {
    return null;
  }

  return payload.sub;
}

/**
 * 토큰에서 사용자 역할 추출
 * @param {string} token - JWT 토큰 문자열
 * @returns {string|null} 사용자 역할 또는 추출 실패 시 null
 */
export function getUserRoleFromToken(token) {
  const payload = parseJwt(token);

  if (!payload || !payload.role) {
    return null;
  }

  return payload.role;
}