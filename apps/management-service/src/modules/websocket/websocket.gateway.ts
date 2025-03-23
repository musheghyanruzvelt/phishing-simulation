import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { PhishingAttempt } from '@phishing-simulation/types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class WebsocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);
  private connections = new Map<string, { userId: string; role: string }>();
  private allSockets = new Set<string>();

  onModuleInit() {
    this.logger.log('WebSocket Gateway initialized - DEBUG MODE');
    this._setupDiagnosticInterval();
  }

  afterInit(server: Server) {
    this.logger.log(
      `WebSocket Server initialized with adapter: ${server.adapter.constructor.name}`,
    );
  }

  async handleConnection(client: Socket) {
    this.allSockets.add(client.id);

    try {
      this._logConnectionDetails(client);
      this._welcomeClient(client);
      this._autoAuthenticateClient(client);
    } catch (error) {
      this.logger.error(
        `Error in handleConnection: ${error.message}`,
        error.stack,
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connections.delete(client.id);
    this.allSockets.delete(client.id);
  }

  @SubscribeMessage('ping')
  handlePing(): WsResponse<string> {
    return { event: 'pong', data: 'pong' };
  }

  @SubscribeMessage('authenticate')
  async authenticate(client: Socket): Promise<void> {
    this._autoAuthenticateClient(client);
  }

  @SubscribeMessage('subscribeToPhishingAttempts')
  async subscribeToPhishingAttempts(client: Socket): Promise<void> {
    if (!this.connections.has(client.id)) {
      this._autoAuthenticateClient(client);
    }

    client.join('phishing-updates');
    const connection = this.connections.get(client.id);

    this.logger.log(
      `Client ${client.id} (User: ${connection?.userId}) subscribed to updates`,
    );

    client.emit('subscriptionConfirmed', {
      message: 'Successfully subscribed to phishing attempt updates',
      userId: connection?.userId,
    });
  }

  @SubscribeMessage('unsubscribeFromPhishingAttempts')
  async unsubscribeFromPhishingAttempts(client: Socket): Promise<void> {
    client.leave('phishing-updates');
  }

  getConnectionsCount() {
    return {
      total: this.allSockets.size,
      subscribed: this.connections.size,
    };
  }

  notifyPhishingAttemptUpdate(phishingAttempt: PhishingAttempt): void {
    this._broadcastToSubscribers('phishingAttemptUpdated', phishingAttempt);
  }

  notifyPhishingAttemptStatusChange(
    phishingAttempt: PhishingAttempt,
    previousStatus: string,
  ): void {
    this._broadcastToSubscribers('phishingAttemptStatusChanged', {
      phishingAttempt,
      previousStatus,
    });
  }

  private _setupDiagnosticInterval() {
    setInterval(() => {
      this.logger.log(
        `Current socket stats: Total=${this.allSockets.size}, Subscribed=${this.connections.size}`,
      );
      if (this.connections.size > 0) {
        this.logger.log('Active subscribed connections:');
        this.connections.forEach((data, clientId) => {
          this.logger.log(
            `- Client: ${clientId}, User: ${data.userId}, Role: ${data.role}`,
          );
        });
      }
    }, 15000);
  }

  private _logConnectionDetails(client: Socket) {
    this.logger.log(`New client connected: ${client.id}`);
    this.logger.log(`Transport: ${client.conn.transport.name}`);
    this.logger.log(`Query params: ${JSON.stringify(client.handshake.query)}`);
    this.logger.log(`Headers:`, client.handshake.headers);
  }

  private _welcomeClient(client: Socket) {
    client.emit('welcome', {
      message: 'Connected to WebSocket server',
      socketId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  private _autoAuthenticateClient(client: Socket) {
    const userId = `auto-${client.id.substring(0, 8)}`;

    this.connections.set(client.id, {
      userId,
      role: 'user',
    });

    client.emit('authSuccess', {
      message: 'Authentication successful (auto)',
      userId,
      role: 'user',
    });

    this.logger.log(`Client ${client.id} authenticated with ID: ${userId}`);
  }

  private _broadcastToSubscribers(event: string, data: unknown): void {
    const room = this.server.sockets.adapter.rooms.get('phishing-updates');
    const roomSize = room ? room.size : 0;

    if (roomSize === 0) {
      this.logger.warn(
        `No clients in 'phishing-updates' room to notify for ${event}`,
      );
      return;
    }

    this.logger.log(
      `Broadcasting ${event} to ${roomSize} clients in 'phishing-updates' room`,
    );
    this.server.to('phishing-updates').emit(event, data);
  }
}
