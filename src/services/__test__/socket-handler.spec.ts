import http from 'http';
import { AddressInfo } from 'net';
import io from 'socket.io-client';

import { dbConnect, dbClose } from '@app/test/setup';
import SocketServer from '../socket-server';
import app from '@app/app';
import User, { userFactory } from '@app/models/user';
import { AuthResponse } from '@app/models/auth';

let server: http.Server;

beforeAll(async () => {
  await dbConnect('test-socket-handler');
  server = http.createServer(app);
  new SocketServer(server);
  await new Promise(res => server.listen(res));
});

afterAll(async () => {
  await dbClose();
  await new Promise(res => server.close(res));
});

describe('socket authorize', () => {
  test('client should recieve authorized event', async () => {
    const user = userFactory.create();
    user.tokens.push({
      client: 'clientID',
      token: 'refreshToken123',
      type: 'refresh'
    });
    await user.save();

    const client = io(`http://localhost:${ (server.address() as AddressInfo).port }`);
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