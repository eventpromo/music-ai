import { InvalidCookieError } from "../models/exceptions";
import SunoSong from "../models/SunoSong";
import SunoUser from "../models/SunoUser";
import { sunoApiFactory, sunoSongService, sunoUserArbitrator, sunoUserService } from "../services";

export async function songGeneratedHandler(sunoSongs: SunoSong[]) {
  if (sunoSongs.length > 1) {
    await sunoSongService.createManySunoSongs(sunoSongs);
  } else {
    await sunoSongService.createSunoSong(sunoSongs[0]);
  }
}

export async function creditsUsedHandler(sunoUser: SunoUser) {
  
  try {
    const sunoApi = await sunoApiFactory.createBySunoUserId(sunoUser.id);
    const creditsLeft = await sunoApi.getCredits();

    if(creditsLeft.credits_left <= 0) {
      await sunoUserService.blockUser(sunoUser.id);
      await sunoUserArbitrator.reload();
    }
  } catch(error) {
    if (error instanceof InvalidCookieError) {
      await sunoUserService.blockUser(sunoUser.id);
      await sunoUserArbitrator.reload();
    }
  }

  await sunoUserService.blockUser(sunoUser.id);
  await sunoUserArbitrator.reload();
}

export async function cookieInvalidatedHandler(sunoUser: SunoUser) {
  await sunoUserService.blockUser(sunoUser.id);
  await sunoUserArbitrator.reload();
}