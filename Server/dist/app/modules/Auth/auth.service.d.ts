import { TChangePassword, TLoginUser, TRegisterUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
export declare const AuthServices: {
    registerUser: (payload: TRegisterUser) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    loginUser: (payload: TLoginUser) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword: (userData: JwtPayload, payload: TChangePassword) => Promise<null>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map