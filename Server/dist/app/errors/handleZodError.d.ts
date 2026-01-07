import { ZodError } from 'zod';
interface TErrorSources {
    path: string | number;
    message: string;
}
declare const handleZodError: (err: ZodError) => {
    statusCode: number;
    message: string;
    errorSources: TErrorSources[];
};
export default handleZodError;
//# sourceMappingURL=handleZodError.d.ts.map