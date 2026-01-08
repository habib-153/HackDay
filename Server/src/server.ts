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

    // Bind to 0.0.0.0 to accept connections from other computers on the network
    server.listen(config.port, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server is running on port ${config.port}`);
      // eslint-disable-next-line no-console
      console.log(`📡 Socket.io initialized`);
      // eslint-disable-next-line no-console
      console.log(`🌐 Accessible at http://YOUR_IP:${config.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

main();

