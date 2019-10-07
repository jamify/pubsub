import * as express from 'express';
import * as socketIo from 'socket.io';
import * as cors from 'cors';
import { Winston } from './logger';
import { Event } from './constants';
import { createServer, Server } from 'http';
import { Track } from './types';

export class Instance {
  public static readonly PORT: number = 3000;
  public static readonly SYSTEM: any = {
    id: 'SYSTEM',
  };
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    this.app = express();

    this.app.get('/ping', (req, res) => {
      Winston.info(`pinged`, {}, Instance.SYSTEM);
      res.send('pong');
      res.end();
    });

    this.port = process.env.PORT || Instance.PORT;
    this.app.use(cors());
    this.app.options('*', cors());
    this.server = createServer(this.app);
    this.initSocket();
    this.listen();
  }

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      Winston.info(`Listening on ${ this.port }`, {}, Instance.SYSTEM);
    });

    this.io.on(Event.CONNECT, (socket: any) => {
      Winston.info(`Connected client on port ${ this.port }.`, {}, Instance.SYSTEM);

      socket.on(Event.CHANNEL, (channel: string, profile: any = {}) => {
        socket.join(channel);
        Winston.info(`Joining channel`, {}, profile, channel);
        this.io.emit(Event.CHANNEL, channel);
      });

      socket.on(Event.DISCONNECT, () => {
        Winston.info(`Disconnected client on port ${ this.port }.`, {}, Instance.SYSTEM);
      });

      socket.on(Event.PROPOGATE, (channel: string, track: Track, profile: any = {}) => {
        Winston.info(`propagating...`, track, profile, channel);
        this.io.sockets.in(channel).emit(Event.TRACK, track);
      });
    });
  }

  get getApp(): express.Application {
    return this.app;
  }
}
