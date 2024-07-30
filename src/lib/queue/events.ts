import SunoSong from "../models/SunoSong";
import SunoUser from "../models/SunoUser";

export enum EventTypes {
  SongsGenerated = "SongsGenerated",
  CreditsUsed = "CreditsUsed",
  CookieInvalidated = "CookieInvalidated",
}

export interface QueueEvent<TPayload> {
  type: EventTypes;
  payload: TPayload;
};

export class SongsGeneratedEvent implements QueueEvent<SunoSong[]> {
  type: EventTypes = EventTypes.SongsGenerated
  payload: SunoSong[];

  constructor(songs: SunoSong[]) {
    this.payload = songs;
  }
}

export class CreditsUsedEvent implements QueueEvent<{ sunoUserId: string }> {
  type: EventTypes = EventTypes.CreditsUsed
  payload: { sunoUserId: string };

  constructor(payload: { sunoUserId: string }) {
    this.payload = payload;
  }
}

export class CookieInvalidatedEvent implements QueueEvent<{ sunoUserId: string }> {
  type: EventTypes = EventTypes.CookieInvalidated
  payload: { sunoUserId: string };

  constructor(payload: { sunoUserId: string }) {
    this.payload = payload;
  }
}