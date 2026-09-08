import { User, Room, RoomDetail, Friendship, Invitation, Notification } from '../types';

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

// Map server user DTO -> client shape (avatar -> avatarUrl alias)
function mapUser(u: any): any {
  return { ...u, avatar: u.avatar, avatarUrl: u.avatar || u.avatarUrl };
}

// Map server room DTO -> client shape
function mapRoom(r: any): any {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    description: r.description,
    thumbnailUrl: r.thumbnail || r.thumbnailUrl,
    privacy: r.privacy,
    maxParticipants: r.maxParticipants,
    currentParticipants: r.memberCount ?? r.currentParticipants ?? 0,
    memberCount: r.memberCount ?? 0,
    category: r.category,
    hostId: r.hostId,
    hostName: r.hostName,
    lastActiveAt: r.lastActiveAt || r.lastActive || new Date().toISOString(),
    lastActive: r.lastActiveAt || r.lastActive,
    createdAt: r.createdAt,
    isActive: r.isActive,
    features: {
      chatEnabled: r.chatEnabled,
      voiceEnabled: r.voiceEnabled,
      videoEnabled: r.videoEnabled,
      screenShareEnabled: r.screenSharingEnabled,
      reactionsEnabled: r.reactionsEnabled,
    },
    playbackPermission: r.playbackPermission,
    reactionPermission: r.reactionPermission,
  };
}

export const api = {
  auth: {
    getMe: async () => mapUser(await fetchApi<any>('/auth/me')),
    login: async (data: any) => {
      const res = await fetchApi<{token: string; user: any}>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
      return { token: res.token, user: mapUser(res.user) };
    },
    register: async (data: any) => {
      const res = await fetchApi<{token: string; user: any}>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
      return { token: res.token, user: mapUser(res.user) };
    },
    updateProfile: async (data: any) => mapUser(await fetchApi<any>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) })),
  },
  rooms: {
    list: async () => (await fetchApi<any[]>('/rooms')).map(mapRoom),
    create: async (data: any) => mapRoom(await fetchApi<any>('/rooms', { method: 'POST', body: JSON.stringify(data) })),
    get: async (id: string) => {
      const d = await fetchApi<any>(`/rooms/${id}`);
      return { ...mapRoom(d), members: d.members || [], recentMessages: d.recentMessages || [] } as RoomDetail;
    },
    update: (id: string, data: any) => fetchApi(`/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi(`/rooms/${id}`, { method: 'DELETE' }),
    join: (id: string, data?: { password?: string }) => fetchApi(`/rooms/${id}/join`, { method: 'POST', body: JSON.stringify(data || {}) }),
    leave: (id: string) => fetchApi(`/rooms/${id}/leave`, { method: 'POST' }),
    members: async (id: string) => fetchApi<any[]>(`/rooms/${id}/members`),
  },
  discover: {
    rooms: async (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const qs = params.toString();
      return (await fetchApi<any[]>(`/discover/rooms${qs ? `?${qs}` : ''}`)).map(mapRoom);
    },
  },
  friends: {
    list: async () => fetchApi<any[]>('/friends'),
    pending: async () => fetchApi<any[]>('/friends/pending'),
    request: (recipientId: string) => fetchApi('/friends/request', { method: 'POST', body: JSON.stringify({ recipientId }) }),
    accept: (friendshipId: string) => fetchApi(`/friends/${friendshipId}/accept`, { method: 'PATCH' }),
    reject: (friendshipId: string) => fetchApi(`/friends/${friendshipId}/reject`, { method: 'PATCH' }),
    remove: (friendshipId: string) => fetchApi(`/friends/${friendshipId}`, { method: 'DELETE' }),
  },
  users: {
    search: (q: string) => fetchApi<any[]>(`/users/search?q=${encodeURIComponent(q)}`),
  },
  invitations: {
    list: async () => fetchApi<Invitation[]>('/invitations'),
    create: (data: any) => fetchApi('/invitations', { method: 'POST', body: JSON.stringify(data) }),
  },
  notifications: {
    list: async () => fetchApi<Notification[]>('/notifications'),
  },
};
