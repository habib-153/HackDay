import mongoose from 'mongoose';

interface TErrorSources {
  path: string | number;
  message: string;
}

const handleCastError = (err: mongoose.Error.CastError) => {
  const errorSources: TErrorSources[] = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;
