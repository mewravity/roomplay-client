import { create } from 'zustand';

interface UIState {
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isMobile: boolean;
  activeTab: 'chat' | 'participants' | 'controls';
  toggleChat: () => void;
  toggleParticipants: () => void;
  setActiveTab: (tab: 'chat' | 'participants' | 'controls') => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isChatOpen: true,
  isParticipantsOpen: false,
  isMobile: window.innerWidth < 768,
  activeTab: 'chat',
  toggleChat: () => set((state) => ({ 
    isChatOpen: !state.isChatOpen,
    isParticipantsOpen: state.isChatOpen ? state.isParticipantsOpen : false
  })),
  toggleParticipants: () => set((state) => ({ 
    isParticipantsOpen: !state.isParticipantsOpen,
    isChatOpen: state.isParticipantsOpen ? state.isChatOpen : false
  })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsMobile: (isMobile) => set({ isMobile }),
}));
