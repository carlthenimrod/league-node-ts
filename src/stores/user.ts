import { EventEmitter } from 'events';

import User, { UserDocument } from '@app/models/user';
import { Helpers } from '@app/models/user/util';
import { ObjectID, ChangeEvent, ChangeEventUpdate } from 'mongodb';

interface UserStored {
  _id: ObjectID;
  email: string;
  name: {
    first: string;
    last: string;
  }
  fullName: string;
  status: {
    new: boolean;
    verified: boolean;
  };
  sockets: string[];
}

/**
 * Store that holds all users connected
 */
const store: UserStored[] = [];

/**
 * Retrieves user from store based on id, 
 * if id is omitted all users are returned
 */
export function get(): UserStored[];
export function get(id: ObjectID): UserStored|undefined;
export function get(id: string): UserStored|undefined;
export function get(id?: ObjectID|string): UserStored|UserStored[]|undefined {
  if (!id) { return [...store]; }

  if (id instanceof ObjectID) {
    return store.find(u => u._id.equals(id));
  } else {
    for (let i = 0; i < store.length; i++) {
      const user = store[i];
      if (user.sockets.find(s => s === id)) {
        return user;
      }
    }
  }
}

/**
 * Adds a user to the user store, if user exists, add socket ID
 */
export function add(user: UserDocument, socketId: string) {
  const match = store.find(u => u._id.equals(user._id));
  
  if (match) {
    match.sockets.push(socketId);
  } else {
    store.push({
      _id: user._id,
      email: user.email,
      name: { ...user.name },
      fullName: user.fullName,
      status: { ...user.status },
      sockets: [socketId]
    });
  }
};

/**
 * Removes user from store, only if no sockets are left
 */
export function remove(userId: ObjectID, socketId: string) {
  const index = store.findIndex(u => u._id.equals(userId));
  const match = store[index];

  match.sockets.splice(match.sockets.indexOf(socketId), 1);
  if (match.sockets.length === 0) { store.splice(index, 1); }
};

/**
 * Scans user store and updates user if found
 */
function update(doc: ChangeEventUpdate<UserStored>): UserStored | boolean {
  const match = store.find(u => u._id.equals(doc.documentKey._id));
  if (!match) { return false; }

  let updated = false;
  const { email, name, status } = doc.fullDocument as UserStored;

  if (match.name.first !== name.first) {
    match.name.first = name.first;
    updated = true;
  }

  if (match.name.last !== name.last) {
    match.name.last = name.last;
    updated = true;
  }

  if (updated) {
    match.fullName = Helpers.getFullName(match.name) as string;
  }
  
  if (match.email !== email) {
    match.email = email;
    updated = true;
  }
  
  if (match.status.new !== status.new) {
    match.status.new = status.new;
    updated = true;
  }
  
  if (match.status.verified !== status.verified) {
    match.status.verified = status.verified;
    updated = true;
  }

  return updated ? match : false;
};

/**
 * Clears store of users
 */
export function clear() {
  store.length = 0;
}

/**
 * Events on user store
 */
export const events = new EventEmitter();

User.watch([], { fullDocument: 'updateLookup' }).on('change', (doc: ChangeEvent<UserStored>) => {
  if (doc.operationType !== 'update') { return; }

  const updated = update(doc);
  if (updated) { events.emit('updated', updated); }
});

export default {
  get,
  add,
  remove,
  clear,
  events
};