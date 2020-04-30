import { model } from 'mongoose';

import userSchema from './schema';
import { UserDocument, UserModel } from './types';
import { Middleware, Statics, Methods } from './util';

export * from './types';

userSchema.pre('save', Middleware.hashPassword);

userSchema.static('findByCredentials', Statics.findByCredentials);
userSchema.static('removeToken', Statics.removeToken);
userSchema.static('refreshToken', Statics.refreshToken);

userSchema.method('confirmEmail', Methods.confirmEmail);
userSchema.method('recoverPassword', Methods.recoverPassword);
userSchema.method('verifyPassword', Methods.verifyPassword);
userSchema.method('generateTokens', Methods.generateTokens);

export default model<UserDocument, UserModel>('User', userSchema);
