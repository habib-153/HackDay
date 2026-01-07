import mongoose from 'mongoose';

interface TErrorSources {
  path: string | number;
  message: string;
}

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: TErrorSources[] = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
