export interface Track {
  artist: string;
  duration: number;
  image: string;
  isPlayable: boolean;
  name: string;
  paused: boolean;
  position: number;
  uri: string;
}

export interface Me {
  name: string;
  url: string;
  id: string;
  image: string;
  product: string;
}

export interface Options {
  message?: string;
  channel?: string;
  me?: Me;
  track?: Track;
}

export interface Log {
  withMessage(message: string): Log;
  withTrack(track: Track): Log;
  withMe(me: Me): Log;
  withChannel(channel: string): Log;
  log(): void;
}
