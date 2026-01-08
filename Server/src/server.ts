import mongoose from 'mongoose';
import { createServer } from 'http';
import app from './app';
import config from './app/config';
import { initializeSocket } from './app/socket';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    const server = createServer(app);

    // Initialize Socket.io
    initializeSocket(server);

    server.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on port ${config.port}`);
      // eslint-disable-next-line no-console
      console.log(`📡 Socket.io initialized`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

main();

