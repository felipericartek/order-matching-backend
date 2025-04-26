import { Server } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: any) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('🟢 Novo cliente conectado:', socket.id);

        socket.on('disconnect', () => {
            console.log('🔴 Cliente desconectado:', socket.id);
        });
    });

    return io;
};

export const emitUpdate = (event: string, data: any) => {
    if (io) {
        io.emit(event, data);
    }
};
