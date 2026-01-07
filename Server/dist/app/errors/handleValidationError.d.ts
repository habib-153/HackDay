import mongoose from 'mongoose';
interface TErrorSources {
    path: string | number;
    message: string;
}
declare const handleValidationError: (err: mongoose.Error.ValidationError) => {
    statusCode: number;
    message: string;
    errorSources: TErrorSources[];
};
export default handleValidationError;
//# sourceMappingURL=handleValidationError.d.ts.map