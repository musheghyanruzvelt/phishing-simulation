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
import { PhishingAttempt } from '../auth/dto/create-user.dto';

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
  private connections: Map<string, { userId: string; role: string }> =
    new Map();
  private allSockets: Set<string> = new Set();

  onModuleInit() {
    this.logger.log('[DIAGNOSTIC] WebSocket Gateway initialized - DEBUG MODE');

    setInterval(() => {
      this.logger.log(
        `[DIAGNOSTIC] Current socket stats: Total=${this.allSockets.size}, Subscribed=${this.connections.size}`,
      );
      if (this.connections.size > 0) {
        this.logger.log('[DIAGNOSTIC] Active subscribed connections:');
        this.connections.forEach((data, clientId) => {
          this.logger.log(
            `- Client: ${clientId}, User: ${data.userId}, Role: ${data.role}`,
          );
        });
      }
    }, 15000);
  }

  afterInit(server: Server) {
    this.logger.log('[DIAGNOSTIC] WebSocket Server initialized with config:');
    this.logger.log(`- Adapter: ${server.adapter.constructor.name}`);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`[DIAGNOSTIC] New client connected: ${client.id}`);

    this.allSockets.add(client.id);

    try {
      this.logger.log(`[DIAGNOSTIC] Connection details:`);
      this.logger.log(`- Transport: ${client.conn.transport.name}`);
      this.logger.log(
        `- Query params: ${JSON.stringify(client.handshake.query)}`,
      );
      this.logger.log(`- Headers:`, client.handshake.headers);

      client.emit('welcome', {
        message: 'Connected to WebSocket server',
        socketId: client.id,
        timestamp: new Date().toISOString(),
      });

      this.autoAuthenticateClient(client);
    } catch (error) {
      this.logger.error(
        `[DIAGNOSTIC] Error in handleConnection: ${error.message}`,
      );
      this.logger.error(error.stack);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[DIAGNOSTIC] Client disconnected: ${client.id}`);
    this.connections.delete(client.id);
    this.allSockets.delete(client.id);
    this.logger.log(
      `[DIAGNOSTIC] Remaining connections: ${this.connections.size}`,
    );
  }
  private autoAuthenticateClient(client: Socket) {
    this.logger.log(`[DIAGNOSTIC] Auto-authenticating client ${client.id}`);

    this.connections.set(client.id, {
      userId: `auto-${client.id.substring(0, 8)}`,
      role: 'user',
    });

    this.logger.log(`[DIAGNOSTIC] Client ${client.id} auto-authenticated`);

    client.emit('authSuccess', {
      message: 'Authentication successful (auto)',
      userId: `auto-${client.id.substring(0, 8)}`,
      role: 'user',
    });

    this.logger.log(
      `[DIAGNOSTIC] Total authenticated clients: ${this.connections.size}`,
    );
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket): WsResponse<string> {
    this.logger.log(`[DIAGNOSTIC] Received ping from client ${client.id}`);
    return { event: 'pong', data: 'pong' };
  }

  @SubscribeMessage('authenticate')
  async authenticate(client: Socket): Promise<void> {
    this.logger.log(
      `[DIAGNOSTIC] Authentication request from client ${client.id} - Auto-authenticating`,
    );

    this.autoAuthenticateClient(client);
  }

  @SubscribeMessage('subscribeToPhishingAttempts')
  async subscribeToPhishingAttempts(client: Socket): Promise<void> {
    this.logger.log(
      `[DIAGNOSTIC] Subscription request from client ${client.id}`,
    );
    if (!this.connections.has(client.id)) {
      this.autoAuthenticateClient(client);
    }

    client.join('phishing-updates');

    const connection = this.connections.get(client.id);
    this.logger.log(
      `[DIAGNOSTIC] Client ${client.id} (User: ${connection?.userId}) subscribed to updates`,
    );

    client.emit('subscriptionConfirmed', {
      message: 'Successfully subscribed to phishing attempt updates',
      userId: connection?.userId,
    });
  }

  @SubscribeMessage('unsubscribeFromPhishingAttempts')
  async unsubscribeFromPhishingAttempts(client: Socket): Promise<void> {
    this.logger.log(`[DIAGNOSTIC] Client ${client.id} unsubscribing`);
    client.leave('phishing-updates');
  }
  getConnectionsCount() {
    return {
      total: this.allSockets.size,
      subscribed: this.connections.size,
    };
  }

  notifyPhishingAttemptUpdate(phishingAttempt: PhishingAttempt): void {
    this.logger.log(
      `[DIAGNOSTIC] Broadcasting update for phishing attempt ${phishingAttempt.id}`,
    );

    const subscribedClients = Array.from(this.connections.keys());
    this.logger.log(
      `[DIAGNOSTIC] Total subscribed clients: ${subscribedClients.length}`,
    );

    if (subscribedClients.length === 0) {
      this.logger.warn('[DIAGNOSTIC] No subscribed clients to notify');
      return;
    }

    this.logger.log('[DIAGNOSTIC] Broadcasting to phishing-updates room');
    this.server
      .to('phishing-updates')
      .emit('phishingAttemptUpdated', phishingAttempt);

    for (const clientId of subscribedClients) {
      const socket = this.server.sockets.sockets.get(clientId);
      if (socket) {
        socket.emit('phishingAttemptUpdated', phishingAttempt);
      }
    }
  }

  notifyPhishingAttemptStatusChange(
    phishingAttempt: PhishingAttempt,
    previousStatus: string,
  ): void {
    this.logger.log(
      `[DIAGNOSTIC] Broadcasting status change for attempt ${phishingAttempt.id}`,
    );

    const subscribedClients = Array.from(this.connections.keys());
    this.logger.log(
      `[DIAGNOSTIC] Total subscribed clients for status change: ${subscribedClients.length}`,
    );

    if (subscribedClients.length === 0) {
      this.logger.warn(
        '[DIAGNOSTIC] No subscribed clients to notify about status change',
      );
      return;
    }

    const updateData = {
      phishingAttempt,
      previousStatus,
    };

    this.server
      .to('phishing-updates')
      .emit('phishingAttemptStatusChanged', updateData);

    for (const clientId of subscribedClients) {
      const socket = this.server.sockets.sockets.get(clientId);
      if (socket) {
        socket.emit('phishingAttemptStatusChanged', updateData);
      }
    }
  }
}
