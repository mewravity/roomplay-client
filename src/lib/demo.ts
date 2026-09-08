export const isDemoMode = () => true; // Always demo for now

export const demoUsers = [
  { id: 'demo-1', username: 'alex', displayName: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', isOnline: true },
  { id: 'demo-2', username: 'sarah', displayName: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', isOnline: true },
  { id: 'demo-3', username: 'mike', displayName: 'Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', isOnline: true },
  { id: 'demo-4', username: 'jamie', displayName: 'Jamie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jamie', isOnline: false },
];

export const demoRooms = [
  { id: 'room-1', code: 'ANIME42', name: 'Friday Anime Night', description: 'Weekly anime watch party!', category: 'Anime', privacy: 'Private', memberCount: 4, thumbnail: '', hostId: 'demo-1', lastActiveAt: new Date().toISOString() },
  { id: 'room-2', code: 'MOVIE99', name: 'Movie Night', description: 'Classic movie marathon', category: 'Movie', privacy: 'Private', memberCount: 3, thumbnail: '', hostId: 'demo-2', lastActiveAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'room-3', code: 'GAME77', name: 'Gaming Stream', description: 'Watch me play!', category: 'Gaming', privacy: 'Public', memberCount: 2, thumbnail: '', hostId: 'demo-3', lastActiveAt: new Date(Date.now() - 7200000).toISOString() },
];

export const demoMessages = [
  { id: 'm1', userId: 'demo-1', username: 'alex', displayName: 'Alex', avatar: demoUsers[0].avatar, content: 'Everyone ready? 🎬', type: 'User' as const, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'm2', userId: 'demo-2', username: 'sarah', displayName: 'Sarah', avatar: demoUsers[1].avatar, content: "LET'S GOOOO 🔥", type: 'User' as const, createdAt: new Date(Date.now() - 240000).toISOString() },
  { id: 'm3', userId: 'demo-3', username: 'mike', displayName: 'Mike', avatar: demoUsers[2].avatar, content: '😂 this episode is going to be great', type: 'User' as const, createdAt: new Date(Date.now() - 180000).toISOString() },
  { id: 'm4', userId: 'system', username: 'System', displayName: 'System', avatar: '', content: 'Jamie joined the room', type: 'System' as const, createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: 'm5', userId: 'demo-4', username: 'jamie', displayName: 'Jamie', avatar: demoUsers[3].avatar, content: 'Sorry I\'m late! What did I miss?', type: 'User' as const, createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: 'm6', userId: 'demo-1', username: 'alex', displayName: 'Alex', avatar: demoUsers[0].avatar, content: 'Nothing yet, we just started!', type: 'User' as const, createdAt: new Date(Date.now() - 30000).toISOString() },
  { id: 'm7', userId: 'demo-2', username: 'sarah', displayName: 'Sarah', avatar: demoUsers[1].avatar, content: 'This part always gets me 😭', type: 'User' as const, createdAt: new Date(Date.now() - 15000).toISOString() },
];

export const demoReactions = ['❤️', '😂', '😮', '😭', '😱', '🔥', '👏', '👍', '👎', '💀'];

// Generates periodic simulated messages
export function startDemoChat(onMessage: (msg: typeof demoMessages[0]) => void): () => void {
  const phrases = [
    'OMG 😱', 'LOL 😂', 'This is so good!', 'No way!!', '🔥🔥🔥', 
    'I can\'t even', 'Plot twist!', 'Called it!', 'Wait what??', 'EMOTIONAL DAMAGE',
    'Best episode ever', 'I\'m crying 😭', 'Iconic scene', 'The music tho 🎵',
  ];
  const interval = setInterval(() => {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    onMessage({
      id: `demo-msg-${Date.now()}`,
      userId: user.id, username: user.username, displayName: user.displayName,
      avatar: user.avatar, content: phrase, type: 'User', createdAt: new Date().toISOString(),
    });
  }, 4000 + Math.random() * 6000);
  return () => clearInterval(interval);
}

// Generates periodic simulated reactions
export function startDemoReactions(onReaction: (emoji: string, user: typeof demoUsers[0]) => void): () => void {
  const interval = setInterval(() => {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    const emoji = demoReactions[Math.floor(Math.random() * demoReactions.length)];
    onReaction(emoji, user);
  }, 2000 + Math.random() * 5000);
  return () => clearInterval(interval);
}
