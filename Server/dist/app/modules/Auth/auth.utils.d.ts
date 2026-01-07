import { JwtPayload } from 'jsonwebtoken';
export declare const createToken: (jwtPayload: {
    userId: string;
    email: string;
    role: string;
}, secret: string, expiresIn: string) => string;
export declare const verifyToken: (token: string, secret: string) => JwtPayload;
//# sourceMappingURL=auth.utils.d.ts.map