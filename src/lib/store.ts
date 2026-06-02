import { create } from 'zustand';

export type Role = 'admin' | 'professor' | 'student' | 'external';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  department?: string;
  bio?: string;
  isOnboarded: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (u: User, t: string) => void;
  setUser: (u: User) => void;
  logout: () => void;
}

const su = localStorage.getItem('sc_user');

export const useAuth = create<AuthStore>((set) => ({
  user: su ? JSON.parse(su) : null,
  token: localStorage.getItem('sc_token'),
  isLoggedIn: !!localStorage.getItem('sc_token'),

  setAuth: (user, token) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_user', JSON.stringify(user));
    set({ user, token, isLoggedIn: true });
  },
  setUser: (user) => {
    localStorage.setItem('sc_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    set({ user: null, token: null, isLoggedIn: false });
  },
}));

// ── 실제 API 호출 함수 ──
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('sc_token');
}

export async function apiCall(path: string, options?: RequestInit) {
  const token = getToken();
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ── 로그인 ──
export async function loginApi(email: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ── 회원가입 ──
export async function registerApi(body: {
  email: string;
  password: string;
  name: string;
  role: Role;
  studentId?: string;
}) {
  return apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ── 프로필 수정 ──
export async function updateProfileApi(body: { name?: string; bio?: string }) {
  return apiCall('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// ── 비밀번호 변경 ──
export async function changePasswordApi(currentPassword: string, newPassword: string) {
  return apiCall('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ── Mock (개발용 fallback) ──
export const mockLogin = (email: string): User => {
  if (email.includes('admin')) return { id: 1, name: '관리자', email, role: 'admin', isOnboarded: true };
  if (email.includes('prof'))  return { id: 2, name: '김스마트', email, role: 'professor', department: '스마트콘텐츠학과', isOnboarded: true };
  return { id: 3, name: '홍길동', email, role: 'student', studentId: '2026000000', department: '스마트콘텐츠학과', isOnboarded: false };
};