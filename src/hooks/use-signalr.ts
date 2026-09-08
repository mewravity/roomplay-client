import { useEffect, useState } from 'react';
import signalRService from '../lib/signalr';
import { useAuthStore } from '../stores/auth-store';
import * as signalR from '@microsoft/signalr';

export function useSignalR(roomId?: string) {
  const { token } = useAuthStore();
  const [state, setState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );

  useEffect(() => {
    if (!token) return;
    let mounted = true;

    const connect = async () => {
      try {
        await signalRService.start(token);
        if (mounted) setState(signalRService.getState());

        if (roomId && signalRService.getState() === signalR.HubConnectionState.Connected) {
          await signalRService.invoke('JoinRoom', roomId);
        }
      } catch (err) {
        console.error('SignalR connection error:', err);
      }
    };

    connect();

    const checkState = setInterval(() => {
      if (mounted) setState(signalRService.getState());
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(checkState);
      if (roomId && signalRService.getState() === signalR.HubConnectionState.Connected) {
        signalRService.invoke('LeaveRoom', roomId).catch(console.error);
      }
    };
  }, [token, roomId]);

  return {
    state,
    isConnected: state === signalR.HubConnectionState.Connected,
    on: (event: string, cb: (...args: any[]) => void) => signalRService.on(event, cb),
    off: (event: string, cb: (...args: any[]) => void) => signalRService.off(event, cb),
    invoke: async (method: string, ...args: any[]) => signalRService.invoke(method, ...args),
  };
}
