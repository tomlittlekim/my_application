/**
 * 사용자 활동 내역 조회 함수
 */
export async function fetchUserActivities(limit = 10) {
  const query = `
    query {
      userActivities(limit: ${limit}) {
        id
        activityType
        detail
        timestamp
      }
    }
  `;

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP ERROR! STATUS: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return [];
    }

    return result.data.userActivities;
  } catch (error) {
    console.error(`활동 내역 조회 실패:`, error);
    return [];
  }
}

/**
 * 활동 타입에 따른 아이콘과 메시지 생성
 */
export function formatActivity(activity) {
  let icon = 'bi bi-activity';
  let message = '';

  switch (activity.activityType) {
    case 'LOGIN':
      icon = 'bi bi-box-arrow-in-right';
      message = '로그인';
      break;
    case 'LOGOUT':
      icon = 'bi bi-box-arrow-right';
      message = '로그아웃';
      break;
    case 'PROFILE_UPDATE':
      icon = 'bi bi-person-gear';
      message = '프로필 정보 변경';
      if (activity.detail) {
        message = activity.detail;
      }
      break;
    case 'PASSWORD_CHANGE':
      icon = 'bi bi-shield-lock';
      message = '비밀번호 변경';
      break;
    case 'CONTENT_ADD':
      icon = 'bi bi-plus-circle';
      message = activity.detail || '콘텐츠 추가';
      break;
    case 'CONTENT_EDIT':
      icon = 'bi bi-pencil-square';
      message = activity.detail || '콘텐츠 수정';
      break;
    case 'CONTENT_DELETE':
      icon = 'bi bi-trash';
      message = activity.detail || '콘텐츠 삭제';
      break;
    default:
      message = activity.detail || '활동 기록';
      break;
  }

  return {
    icon,
    message
  };
}