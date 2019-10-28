import * as express from 'express';
import * as socketIo from 'socket.io';
import * as cors from 'cors';
import { Event } from './constants';
import { createServer, Server } from 'http';
import { Track } from './types';
import { Logger } from './logger/logger';

export class Instance {
  public static readonly PORT: number = 3000;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  private logger: Logger = new Logger('PUBSUB');

  constructor() {
    this.app = express();

    this.app.get('/ping', (req, res) => {
      this.logger.atInfo().withMessage('pinged').log();
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
      this.logger.atInfo().withMessage(`Listening on ${ this.port }`).log();
    });

    this.io.on(Event.CONNECT, (socket: any) => {
      this.logger.atInfo().withMessage(`Connected client on port ${ this.port }.`).log();
      socket.on(Event.CHANNEL, (channel: string, profile: any = {}) => {
        socket.join(channel);
        this.logger.atInfo().withMessage('Joining channel.').withChannel(channel).log();
        this.io.emit(Event.CHANNEL, channel);
      });

      socket.on(Event.DISCONNECT, () => {
        this.logger.atInfo().withMessage(`Disconnected client on port ${ this.port }.`).log();
      });

      socket.on(Event.PROPOGATE, (channel: string, track: Track, profile: any = {}) => {
        this.logger.atInfo().withMessage('propagating...').withTrack(track).withMe(profile).withChannel(channel).log();
        this.io.sockets.in(channel).emit(Event.TRACK, track);
      });
    });
  }

  get getApp(): express.Application {
    return this.app;
  }
}
