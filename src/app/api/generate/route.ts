import { NextRequest } from "next/server";
import { getCurrentSunoUser, sunoApiFactory } from "@/lib/services";
import { DEFAULT_MODEL } from "@/lib/SunoApi";
import { options, post, withRetry } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { queue } from "@/lib/queue";
import { CreditsUsedEvent, SongsGeneratedEvent } from "@/lib/queue/events";

export const dynamic = "force-dynamic";

export const POST = withRetry(post(async (req: NextRequest) => {
  const body = await req.json();
  const { prompt, make_instrumental, model, wait_audio } = body;
  
  const currentSunoUser = await getCurrentSunoUser();
  const sunoApi = await sunoApiFactory.createBySunoUser(currentSunoUser);

  const sunoSongInfos = await sunoApi.generate(
    prompt,
    Boolean(make_instrumental),
    model || DEFAULT_MODEL,
    Boolean(wait_audio)
  );
  
  const songIds = new Set(sunoSongInfos.map(song => song.id));
  const sunoSongs = Array.from(songIds).map(songId => ({
    id: songId,
    sunoUserId: sunoApi.currentUserId
  }));

  queue.emit(new SongsGeneratedEvent(sunoSongs));
  queue.emit(new CreditsUsedEvent({
    sunoUserId: sunoApi.currentUserId,
  }));

  return okResponse(sunoSongInfos);
}), 2, 1000);


export { options as OPTIONS };