import {routes} from './routes.js';

export function router() {
  const hash = window.location.hash;
  // routes 배열에서 일치하는 route 찾기
  const route = routes.find(r => hash.match(r.path));

  if (route) {
    // 매칭되는 경로에서 캡쳐된 그룹 (정규식 매칭 결과)
    const params = hash.match(route.path);
    loadPage(route.fragment, (template) => route.callback(template, params));
  } else {
    console.error(`No route defined for ${hash}`);
  }
}

async function loadPage(url, callback) {
  try {
    const response = await fetch(url);
    const template = await response.text();
    const app = document.getElementById('app');
    app.innerHTML = template;

    if (callback) callback(template);
  } catch (error) {
    console.error(`Failed to load page: ${error}`);
  }
}