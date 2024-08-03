import { sunoApiFactory, sunoSongService, sunoUserService } from "../services";
import { CookieInvalidatedEvent, CreditsUsedEvent, SongsGeneratedEvent } from "./events";

export async function songGeneratedHandler(payload: typeof SongsGeneratedEvent.prototype.payload) {
  if (payload.length > 1) {
    await sunoSongService.createManySunoSongs(payload);
  } else {
    await sunoSongService.createSunoSong(payload[0]);
  }
}

export async function creditsUsedHandler(payload: typeof CreditsUsedEvent.prototype.payload) {  
  const { sunoUserId } = payload;
  const sunoUser = await sunoUserService.getSunoUserById(sunoUserId);
  const sunoApi = await sunoApiFactory.createBySunoUser(sunoUser);
  const sunoUserCredits = await sunoApi.getCredits();

  await sunoUserService.updateSunoUserCredits(sunoUserId, sunoUserCredits.creditsLeft);
}

export async function cookieInvalidatedHandler(payload: typeof CookieInvalidatedEvent.prototype.payload) {
  const { sunoUserId, noCredits } = payload;
  if (noCredits) {
    await sunoUserService.updateSunoUserCredits(sunoUserId, 0);
  } else {
    await sunoUserService.blockSunoUser(sunoUserId);
  }
}