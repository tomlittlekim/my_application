import {router} from './router.js';
import {initializeHeader} from './components/header.js';

// 페이지 로드 시 헤더 초기화 및 라우터 실행
window.addEventListener('DOMContentLoaded', () => {
  // 헤더 로드 및 초기화
  loadHeader().then(() => {
    // 헤더 UI 초기화
    initializeHeader();

    // 라우터 실행
    router();
  });
});

// 해시 변경 시 라우터 실행
window.addEventListener('hashchange', router);

/**
 * 헤더 컴포넌트를 로드하는 함수
 */
async function loadHeader() {
  try {
    // fragments/components 디렉토리에서 헤더 템플릿 로드
    const response = await fetch('/fragments/components/header.html');
    const headerTemplate = await response.text();

    // 컨테이너 시작 부분에 헤더 삽입
    const container = document.querySelector('.container');
    if (container) {
      container.insertAdjacentHTML('afterbegin', headerTemplate);
    }
  } catch (error) {
    console.error('헤더 로드 실패:', error);
  }
}