import http from 'http';
import { AddressInfo } from 'net';
import io from 'socket.io-client';

import app from '@app/app';
import { socketServer } from '@services/socket';
import User, { userFactory } from '@app/models/user';
import { AuthResponse } from '@app/models/auth';

let httpServer: http.Server;

beforeAll(async () => {
  httpServer = http.createServer(app);
  socketServer(httpServer);

  await new Promise(res => httpServer.listen(res));
});

afterAll(async () => {
  await new Promise(res => httpServer.close(res));
});

describe('socket authorize', () => {
  test('client should recieve authorized event', async () => {
    const user = userFactory.create();
    user.tokens.push({
      client: 'clientID',
      token: 'refreshToken123',
      type: 'refresh'
    });

    const client = io(`http://localhost:${ (httpServer.address() as AddressInfo).port }`);
    await new Promise(res => client.on('connect', res));
    
    const mock = jest.fn(() => 
      Promise.resolve({ user, access_token: 'accessToken123' })
    );
    User.refreshToken = mock;

    client.emit('authorize', { client: 'clientID', refresh_token: 'refreshToken123' });
    const authResponse = await new Promise<AuthResponse>(res => client.on('authorized', res));

    client.close();

    expect(mock).toHaveBeenCalled();
    expect(authResponse._id.toString()).toEqual(user._id.toString());
    expect(
      Object.keys(authResponse)
    ).toEqual(
      expect.arrayContaining([ 
        '_id', 
        'name', 
        'fullName', 
        'email', 
        'status',
        'teams',
        'img',
        'access_token',
        'client',
        'refresh_token'
      ])
    );
  });
});