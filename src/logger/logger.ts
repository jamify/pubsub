import { Level } from './level';
import { Log } from './log';
import { LogContext } from './logContext';

export class Logger {
  public category: string;

  constructor(category: string) {
    this.category = category;
  }

  public atDebug(): Log {
    if (this.isLegal(Level.DEBUG)) {
      return new LogContext(Level.DEBUG);
    }
  }

  public atInfo(): Log {
    if (this.isLegal(Level.INFO)) {
      return new LogContext(Level.INFO);
    }
  }

  private isLegal(level: Level): boolean {
    return true;
  }
}
