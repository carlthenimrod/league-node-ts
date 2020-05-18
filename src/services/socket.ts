import { Server as HttpServer } from 'http';
import socketIO, { Server as IOServer, Socket } from 'socket.io';

import User from '@models/user';
import userStore from '@stores/user';

/**
 * socket.io server
 */
export let io: IOServer;

/**
 * Starts socket.io server
 * @param httpServer {http.Server} server to bind to
 */
export function socketServer(httpServer: HttpServer) {
  io = socketIO(httpServer);

  io.on('connect', socket => new SocketHandler(socket));
}

/**
 * Handler for new socket connections
 */
class SocketHandler {
  private _timeout = setTimeout(this._disconnect, 5000);

  constructor(public socket: Socket) {
    this.socket.on('authorize', this._authorize.bind(this));
  }

  /**
   * Authorize socket, send auth back, add to store
   */
  private _authorize({ client, refresh_token }: { client: string, refresh_token: string }) {    
    clearTimeout(this._timeout);
    
    User.refreshToken(client, refresh_token)
      .then(({ user, access_token }) => {
        userStore.add({ ...user.toObject() }, this.socket.id);

        this.socket.emit('authorized', {
          _id: user._id,
          email: user.email,
          name: user.name,
          fullName: user.fullName,
          status: user.status,
          img: user.img,
          teams: user.teams,
          client,
          access_token,
          refresh_token
        });  
      })
      .catch(e => console.error(e));
  }

  /**
   * Disconnects socket
   */
  private _disconnect() {
    this.socket.disconnect(true);
  }
}