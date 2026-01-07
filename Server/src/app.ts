import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true,
  }),
);

// Application routes
app.use('/api/v1', router);

// Test route
app.get('/', (_req: Request, res: Response) => {
  res.send('HackDay Server is running!');
});

// Global error handler
app.use(globalErrorHandler);

// Not found handler
app.use(notFound);

export default app;
