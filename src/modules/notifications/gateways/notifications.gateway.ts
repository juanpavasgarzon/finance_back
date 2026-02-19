import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

import type { JwtPayload } from 'modules/auth/contracts/jwt-payload.interface';

import { NOTIFICATIONS_NAMESPACE } from '../constants/notifications.constants';

@WebSocketGateway({ namespace: NOTIFICATIONS_NAMESPACE })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    const auth = client.handshake.auth as Record<string, unknown>;
    const query = client.handshake.query as Record<string, unknown>;
    const token = auth?.token ?? query?.token ?? undefined;
    if (!token) {
      this.logger.warn(`Client ${client.id} connected without token`);
      client.disconnect();
      return;
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(token as string);
    } catch {
      this.logger.warn(`Client ${client.id} invalid token`);
      client.disconnect();
      return;
    }

    const tenantId = payload.tenantId;
    const room = this.tenantRoom(tenantId);

    void client.join(room);
    client.data = { tenantId, userId: payload.sub };
    this.logger.log(`Client ${client.id} joined room ${room}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  emitToTenant(tenantId: string, event: string, payload: unknown): void {
    const room = this.tenantRoom(tenantId);
    this.server.to(room).emit(event, payload);
  }

  private tenantRoom(tenantId: string): string {
    return `tenant_${tenantId}`;
  }
}
