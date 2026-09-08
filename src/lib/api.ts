import { User, Room, RoomDetail, Message, Media, Friendship, Invitation, Notification } from '../types';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('roomplay_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}

export const api = {
  auth: {
    getMe: () => fetchApi<User>('/auth/me'),
    login: (data: any) => fetchApi<{token: string; user: User}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    register: (data: any) => fetchApi<{token: string; user: User}>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    demoLogin: () => fetchApi<{token: string; user: User}>('/auth/demo-login', {
      method: 'POST'
    }),
    updateProfile: (data: any) => fetchApi<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },
  rooms: {
    list: () => fetchApi<Room[]>('/rooms'),
    create: (data: any) => fetchApi<RoomDetail>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    get: (id: string) => fetchApi<RoomDetail>(`/rooms/${id}`),
    update: (id: string, data: any) => fetchApi<RoomDetail>(`/rooms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id: string) => fetchApi(`/rooms/${id}`, { method: 'DELETE' }),
    join: (id: string, data?: { password?: string }) => fetchApi(`/rooms/${id}/join`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    }),
    leave: (id: string) => fetchApi(`/rooms/${id}/leave`, { method: 'POST' }),
  }
};
