import { Level } from '../constants';
import { Log } from '../types';
import { LogContext } from './logContext';
import { NoOp } from './noOp';

export class Logger {
  private static NO_OP: NoOp = new NoOp();

  public category: string;

  constructor(category: string) {
    this.category = category;
  }

  public atDebug(): Log {
    if (this.isLegal(Level.DEBUG)) {
      return new LogContext(Level.DEBUG);
    } else {
      return Logger.NO_OP;
    }
  }

  public atInfo(): Log {
    if (this.isLegal(Level.INFO)) {
      return new LogContext(Level.INFO);
    } else {
      return Logger.NO_OP;
    }
  }

  private isLegal(level: Level): boolean {
    return true;
  }
}
