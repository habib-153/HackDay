export interface TLoginUser {
    email: string;
    password: string;
}
export interface TRegisterUser {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
}
export interface TChangePassword {
    oldPassword: string;
    newPassword: string;
}
//# sourceMappingURL=auth.interface.d.ts.map