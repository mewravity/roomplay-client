import { create } from 'zustand';
import { RoomDetail, RoomMember, Message, PlaybackState, ReactionEvent } from '../types';

interface RoomState {
  currentRoom: RoomDetail | null;
  members: RoomMember[];
  messages: Message[];
  playbackState: PlaybackState;
  reactions: ReactionEvent[];
  isScreenSharing: boolean;
  screenShareUserId: string | null;
  
  setRoom: (room: RoomDetail) => void;
  setMembers: (members: RoomMember[]) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setPlaybackState: (state: PlaybackState) => void;
  addReaction: (reaction: ReactionEvent) => void;
  setScreenShare: (isSharing: boolean, userId: string | null) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  members: [],
  messages: [],
  playbackState: { isPlaying: false, currentTime: 0, updatedAt: new Date().toISOString(), speed: 1 },
  reactions: [],
  isScreenSharing: false,
  screenShareUserId: null,

  setRoom: (room) => set({ currentRoom: room }),
  setMembers: (members) => set({ members }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  setPlaybackState: (state) => set({ playbackState: state }),
  addReaction: (reaction) => set((state) => ({ reactions: [...state.reactions, reaction] })),
  setScreenShare: (isSharing, userId) => set({ isScreenSharing: isSharing, screenShareUserId: userId }),
  clearRoom: () => set({
    currentRoom: null,
    members: [],
    messages: [],
    playbackState: { isPlaying: false, currentTime: 0, updatedAt: new Date().toISOString(), speed: 1 },
    reactions: [],
    isScreenSharing: false,
    screenShareUserId: null
  })
}));
