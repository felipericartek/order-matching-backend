import app from './app';
import { createServer } from 'http';
import { initSocket } from './socket/socket';

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
