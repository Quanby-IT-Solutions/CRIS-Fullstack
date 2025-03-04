// import { NextApiRequest, NextApiResponse } from 'next';
// import { Server } from 'socket.io';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (!res.socket) {
//     console.error('Socket not found');
//     res.end();
//     return;
//   }

//   const socket = res.socket as any;

//   if (!socket.server?.io) {
//     console.log('Initializing Socket.IO');
//     const io = new Server(socket.server);
//     socket.server.io = io;

//     io.on('connection', (socket: any) => {
//       console.log('New client connected:', socket.id);
//       socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//       });
//     });
//   }
//   res.end();
// }


// Add later - tat