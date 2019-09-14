import * as express from 'express';
import * as socketIo from 'socket.io';
import * as cors from 'cors';
import { Winston } from './logger';
import { Event } from './constants';
import { createServer, Server } from 'http';

export class Instance {
  public static readonly PORT: number = 8080;
  public static readonly SYSTEM: any = {
    id: -1,
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

      socket.on(Event.MESSAGE, (m: string) => {
        Winston.info(`[server](message): ${ m }`, {}, Instance.SYSTEM);
        this.io.emit('message', m);
      });
      socket.on(Event.DISCONNECT, () => {
        Winston.info(`Disconnected client on port ${ this.port }.`, {}, Instance.SYSTEM);
      });
    });
  }

  get getApp(): express.Application {
    return this.app;
  }
}
