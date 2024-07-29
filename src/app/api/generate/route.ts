import { NextRequest } from "next/server";
import { sunoApiFactory } from "@/lib/services";
import { DEFAULT_MODEL } from "@/lib/SunoApi";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { queue } from "@/lib/queue";
import { CreditsUsedEvent, SongsGeneratedEvent } from "@/lib/queue/events";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { prompt, make_instrumental, model, wait_audio } = body;
    const sunoApi = await sunoApiFactory.create();

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
  } catch (error: any) {
    console.error('Error generating custom audio:', JSON.stringify(error.response.data));
    
    if (error.response.status === 402) {
      return errorResponse({ error: error.response.data.detail }, 402);
    }

    return errorResponse({ error: 'Internal server error: ' + JSON.stringify(error.response.data.detail) }, 500);
  }
});


export { options as OPTIONS };