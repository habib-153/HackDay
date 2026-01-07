import { Model } from 'mongoose';
export interface TUser {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TUserMethods {
    isPasswordMatched(plainPassword: string): Promise<boolean>;
}
export type UserModel = Model<TUser, Record<string, never>, TUserMethods>;
//# sourceMappingURL=user.interface.d.ts.map