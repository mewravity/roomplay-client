import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private static instance: SignalRService;

  static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  async start(token: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) return;
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/room', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.onreconnecting(() => console.log('SignalR reconnecting...'));
    this.connection.onreconnected(() => console.log('SignalR reconnected'));
    this.connection.onclose(() => console.log('SignalR disconnected'));

    await this.connection.start();
  }

  async stop(): Promise<void> {
    await this.connection?.stop();
    this.connection = null;
  }

  getConnection(): signalR.HubConnection | null {
    return this.connection;
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.connection?.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void): void {
    this.connection?.off(event, callback);
  }

  async invoke(method: string, ...args: any[]): Promise<any> {
    return this.connection?.invoke(method, ...args);
  }

  getState(): signalR.HubConnectionState {
    return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
  }
}

export const signalRService = SignalRService.getInstance();
export default signalRService;
