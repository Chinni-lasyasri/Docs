import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EditorGateway {
  @WebSocketServer()
  server: Server;

  private documents: Record<string, string> = {};
  // private documentUsers: Record<string, string[]> = {};
  private documentUsers: Record<
    string,
    { socketId: string; username: string }[]
  > = {};

  handleConnection(client: Socket) {
    console.log('User connected:', client.id);
    // console.log('client data:', client);
  }

  @SubscribeMessage('send-changes')
  handleChanges(
    @MessageBody()
    data: {
      docId: string;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.documents[data.docId] = data.content;

    client.to(data.docId).emit('receive-changes', data.content);
  }

  @SubscribeMessage('join-document')
  handleJoin(
    @MessageBody()
    data: { docId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { docId, username } = data;

    client.join(docId);

    if (!this.documents[docId]) {
      this.documents[docId] = '';
    }

    if (!this.documentUsers[docId]) {
      this.documentUsers[docId] = [];
    }

    this.documentUsers[docId].push({
      socketId: client.id,
      username,
    });

    this.server.to(docId).emit('users-update', this.documentUsers[docId]);

    client.emit('load-document', this.documents[docId]);
  }

  handleDisconnect(client: Socket) {
    for (const docId in this.documentUsers) {
      this.documentUsers[docId] = this.documentUsers[docId].filter(
        (user) => user.socketId !== client.id,
      );

      this.server.to(docId).emit('users-update', this.documentUsers[docId]);
    }
  }
}
