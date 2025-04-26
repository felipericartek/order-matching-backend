import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
