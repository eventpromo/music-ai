import { NextRequest } from "next/server";
import { sunoApiFactory } from "@/lib/services";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { queue } from "@/lib/queue";
import { CreditsUsedEvent } from "@/lib/queue/events";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  const body = await req.json();    
  const { clip_id } = body;

  if (!clip_id) {
    return errorResponse({ error: 'Clip id is required' }, 400);
  }

  const sunoApi = await sunoApiFactory.createBySunoSongId(clip_id);
  const audioInfo = await sunoApi.concatenate(clip_id);

  queue.emit(new CreditsUsedEvent({
    sunoUserId: sunoApi.currentUserId,
  }));
  
  return okResponse(audioInfo);
});

export { options as OPTIONS };
