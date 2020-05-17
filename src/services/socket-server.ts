import { Server as HttpServer } from 'http';
import socketIO, { Server as IOServer, Socket } from 'socket.io';

import SocketHandler from './socket-handler';

export default class SocketServer {
  private _io: IOServer;  
  sockets: SocketHandler[] = [];

  constructor(httpServer: HttpServer) {
    this._io = socketIO(httpServer);

    this._io.on('connect', this._connect.bind(this));
  }

  private _connect(socket: Socket) {
    const socketHandler = new SocketHandler(socket);

    this.sockets.push(socketHandler);
  }
}