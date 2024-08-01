import { NextRequest } from "next/server";
import { DEFAULT_MODEL } from "@/lib/SunoApi";
import { sunoApiFactory } from "@/lib/services";
import { options, post } from "@/lib/http/requests";
import { okResponse } from "@/lib/http/responses";
import { queue } from "@/lib/queue";
import { CreditsUsedEvent, SongsGeneratedEvent } from "@/lib/queue/events";

export const maxDuration = 60; // allow longer timeout for wait_audio == true
export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  const body = await req.json();
  const { prompt, tags, title, make_instrumental, model, wait_audio } = body;
  
  const sunoApi = await sunoApiFactory.createBySunoUserId();
  const sunoSongInfos = await sunoApi.custom_generate(
    prompt, tags, title,
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
});

export { options as OPTIONS };
