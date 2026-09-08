// Common Enums
export enum RoomPrivacy {
  Public = 'Public',
  Private = 'Private'
}

export enum PlaybackPermission {
  HostOnly = 'HostOnly',
  Everyone = 'Everyone'
}

export enum ReactionPermission {
  None = 'None',
  Everyone = 'Everyone'
}

export enum MemberRole {
  Host = 'Host',
  Moderator = 'Moderator',
  Member = 'Member'
}

// User & Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  avatar?: string;
  status?: string;
  isOnline?: boolean;
  createdAt?: string;
}

// Room Types
export interface Room {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  privacy: RoomPrivacy;
  maxParticipants: number;
  currentParticipants: number;
  category?: string;
  hostId: string;
  hostName: string;
  createdAt: string;
  lastActive: string;
}

export interface RoomDetail extends Room {
  playbackPermission: PlaybackPermission;
  reactionPermission: ReactionPermission;
  features: {
    chatEnabled: boolean;
    voiceEnabled: boolean;
    videoEnabled: boolean;
    screenShareEnabled: boolean;
    reactionsEnabled: boolean;
  };
  currentMedia?: Media;
}

export interface RoomMember {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: MemberRole;
  joinedAt: string;
  isOnline: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

export interface Media {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'youtube' | 'screen_share';
  duration?: number;
  addedBy: string;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
  replyToId?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  updatedAt: string;
  mediaId?: string;
  speed: number;
}

export interface ReactionEvent {
  id: string;
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatarUrl?: string;
  status: 'Pending' | 'Accepted';
  createdAt: string;
}

export interface Invitation {
  id: string;
  roomId: string;
  roomName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'Invitation' | 'FriendRequest' | 'System';
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
