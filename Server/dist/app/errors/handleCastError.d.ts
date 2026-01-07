import mongoose from 'mongoose';
interface TErrorSources {
    path: string | number;
    message: string;
}
declare const handleCastError: (err: mongoose.Error.CastError) => {
    statusCode: number;
    message: string;
    errorSources: TErrorSources[];
};
export default handleCastError;
//# sourceMappingURL=handleCastError.d.ts.map