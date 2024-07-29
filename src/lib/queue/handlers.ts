import SunoSong from "../models/SunoSong";
import SunoUser from "../models/SunoUser";
import { sunoSongService, sunoUserService } from "../services";

export async function songGeneratedHandler(sunoSongs: SunoSong[]) {
  if (sunoSongs.length > 1) {
    await sunoSongService.createManySunoSongs(sunoSongs);
  } else {
    await sunoSongService.createSunoSong(sunoSongs[0]);
  }
}

export async function creditsUsedHandler(sunoUser: SunoUser) {
  // await sunoUserService.updateSunoUser(sunoUser);
}