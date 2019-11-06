import { Level } from '../constants';
import { Track, Me, Log } from '../types';

export class NoOp implements Log {

  public withMessage(message: string): Log {
    return this;
  }

  public withChannel(channel: string): Log {
    return this;
  }

  public withMe(me: Me): Log {
    return this;
  }

  public withTrack(track: Track): Log {
    return this;
  }

  public log() {
    return;
  }
}
