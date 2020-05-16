import { Socket } from 'socket.io';

import User from '@models/user';

export default class SocketHandler {
  // private _timeout = setTimeout(this._disconnect, 5000);

  constructor(public socket: Socket) {
    // this._socket.on('authorize', this._authorize);
  }

  /**
   * Authorize socket, send auth back
   */
  private _authorize({ client, refresh_token }: { client: string, refresh_token: string }) {
    // clearTimeout(this._timeout);
    
    User.refreshToken(client, refresh_token)
      .then(({ user, access_token }) => {

      })
      .catch();
  }
}