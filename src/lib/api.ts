// API 헬퍼 - 백엔드 연결 시 이 파일만 수정하면 됩니다
const BASE = '/api';

function getToken() { return localStorage.getItem('sc_token') || ''; }

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '서버 오류' }));
    throw new Error(err.error || '요청 실패');
  }
  return res.json();
}

export const api = {
  get:    (path: string) => apiFetch(path),
  post:   (path: string, body: unknown) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  patch:  (path: string, body: unknown) => apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => apiFetch(path, { method: 'DELETE' }),
};
