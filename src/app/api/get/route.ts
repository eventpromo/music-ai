import { get, options } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import SunoSongInfo from "@/lib/models/SunoSongInfo";
import SunoUser from "@/lib/models/SunoUser";
import { getCurrentSunoUser, sunoApiFactory } from "@/lib/services";

export const dynamic = "force-dynamic";

export const GET = get(async({ url }) => {
  const songIds = url.searchParams.get('ids');
  
  if (!songIds || songIds.length === 0) {
    return errorResponse({ error: 'Missing parameter ids' }, 400);
  }
  
  const idsArray = songIds.split(',');
  const usersToSongsMap = new Map<SunoUser, string[]>();
  
  for (const songId of idsArray) {
    const sunoUser = await getCurrentSunoUser({ sunoSongId: songId });
    if (usersToSongsMap.has(sunoUser)) {
      usersToSongsMap.get(sunoUser)?.push(songId);
      continue;
    } else {
      usersToSongsMap.set(sunoUser, [songId]);
    }
  }
  
  let sunoSongInfos: SunoSongInfo[] = [];
  
  for (const [sunoUser, songIds] of usersToSongsMap) {
    const sunoApi = await sunoApiFactory.createBySunoUser(sunoUser);
    const songs = await sunoApi.get(songIds);

    sunoSongInfos = [...songs, ...sunoSongInfos];

  }

  return okResponse(sunoSongInfos);
});

export { options as OPTIONS };