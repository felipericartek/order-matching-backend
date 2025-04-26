import { Server } from 'socket.io';

let ioInstance: Server;

export const setupSocket = (io: Server) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
    });
};

export const emitUpdate = (event: string, data: any) => {
    ioInstance.emit(event, data);
};
