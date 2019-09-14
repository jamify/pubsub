import { createLogger, transports } from 'winston';

export class Winston {

  public static info(message: string, body: any, obj: any = {}, origin: string = 'PUBSUB') {
    const logObject = {
      sessionId: obj.id || this.getSessionId(),
      level: 'info',
      message,
      body,
      origin,
    };
    if (this.logger) {
      this.logger.info(logObject);
    }
  }

  private static logger = createLogger({
    transports: [
      new transports.Console(),
    ],
  });

  private static sessionId = 0;

  private static getSessionId() {
    this.sessionId += 1;
    if (this.logger) {
      this.logger.info({
        message: `Starting session ${ this.sessionId }`, body: {}, id: this.sessionId, user: 'SYSTEM',
      });
    }
    return this.sessionId;
  }
}
