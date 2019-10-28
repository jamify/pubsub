import { Track, Me } from '../types';

export interface Log {
  withMessage(message: string): Log;
  withTrack(track: Track): Log;
  withMe(me: Me): Log;
  withChannel(channel: string): Log;
  log(): void;
}
