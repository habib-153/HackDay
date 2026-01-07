interface TErrorSources {
    path: string | number;
    message: string;
}
declare const handleDuplicateError: (err: any) => {
    statusCode: number;
    message: string;
    errorSources: TErrorSources[];
};
export default handleDuplicateError;
//# sourceMappingURL=handleDuplicateError.d.ts.map