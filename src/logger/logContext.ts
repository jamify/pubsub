import { Level } from '../constants';
import { Track, Me, Options, Log } from '../types';
import { createLogger, transports, Logger, format } from 'winston';

export class LogContext implements Log {

  private static logger: Logger = createLogger({
    format: format.combine(
      format.prettyPrint(),
    ),
    transports: [
      new transports.Console({ level: 'debug' }),
    ],
  });

  private level: Level;
  private d: Options;

  constructor(level: Level) {
    this.level = level;
    this.d = new Object();
  }

  public withMessage(message: string): Log {
    this.d.message = message;
    return this;
  }

  public withChannel(channel: string): Log {
    this.d.channel = channel;
    return this;
  }

  public withMe(me: Me): Log {
    this.d.me = me;
    return this;
  }

  public withTrack(track: Track): Log {
    this.d.track = track;
    return this;
  }

  public log() {
    if (this.level === Level.DEBUG) {
      LogContext.logger.debug(this.d);
    } else if (this.level === Level.INFO) {
      LogContext.logger.info(this.d);
    }
  }
}
