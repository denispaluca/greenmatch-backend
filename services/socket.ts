import type { Server as HTTPServer } from "http";
import { parseCookies } from "../utils/parseCookies";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";
import { Notification } from "../types/notification";



let io: Server;

let userIdToSocketIds = new Map<string, string[]>();
let socketIdToUserId = new Map<string, string>();


const onConnect = (socket: Socket) => {
  const userId = (socket as any).userId;

  if (!userIdToSocketIds.has(userId)) {
    userIdToSocketIds.set(userId, []);
  }

  userIdToSocketIds.get(userId)!.push(socket.id);
  socketIdToUserId.set(socket.id, userId);

  socket.on('disconnect', (msg) => {
    socketIdToUserId.delete(socket.id);
    const socketIds = userIdToSocketIds.get(userId);
    if (socketIds) {
      socketIds.splice(socketIds.indexOf(socket.id), 1);
    }
  });
};

const middleware = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  const cookie = socket.handshake.headers.cookie;
  if (!cookie) {
    next(new Error("Unauthorized"));
    return;
  }
  const cookieDict = parseCookies(cookie);

  if (!cookieDict.token) {
    next(new Error("Unauthorized"));
    return;
  }
  const token = cookieDict.token;
  // verifies secret and checks exp
  jwt.verify(token, process.env.JwtSecret || 'secret', (err, decoded) => {
    if (err) {
      next(new Error("Unauthorized"));
      return;
    }

    // if everything is good, save to request for use in other routes
    if (!decoded || typeof decoded !== "object") {
      next(new Error("Unauthorized"));
      return;
    }

    if (decoded.role !== 'buyer') {
      next(new Error("Unauthorized"));
      return;
    }
    (socket as any).userId = decoded._id;
    next();
  });
};

export const init = async (httpServer: HTTPServer, origin: string) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use(middleware);

  io.on('connection', onConnect);
}

export const emitNotification = (userId: string, notification: Notification) => {
  const socketIds = userIdToSocketIds.get(userId);
  if (socketIds) {
    for (const socketId of socketIds) {
      io.to(socketId).emit('notification', notification);
    }
  }
}