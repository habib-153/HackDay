import { ZodError, ZodIssue } from 'zod';

interface TErrorSources {
  path: string | number;
  message: string;
}

const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSources[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;
