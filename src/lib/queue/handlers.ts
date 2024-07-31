import { InvalidCookieError, SunoApiError } from "../models/exceptions";
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
  try {
    const { sunoUserId } = payload;
    const sunoApi = await sunoApiFactory.createBySunoUserId(sunoUserId);
    const creditsLeft = await sunoApi.getCredits();

    if (creditsLeft.credits_left <= 0) {
      await sunoUserService.blockUser(sunoUserId);
    }
  } catch(error) {
    if (error instanceof InvalidCookieError || error instanceof SunoApiError) {
      await sunoUserService.blockUser(error.sunoUserId);
    }
  }
}


export async function cookieInvalidatedHandler(payload: typeof CookieInvalidatedEvent.prototype.payload) {
  const { sunoUserId } = payload;
  await sunoUserService.blockUser(sunoUserId)
}