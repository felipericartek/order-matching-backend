import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket/socket';

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

setupSocket(io);

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
