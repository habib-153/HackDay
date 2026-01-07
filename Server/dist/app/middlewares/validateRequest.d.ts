import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';
declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => void;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map