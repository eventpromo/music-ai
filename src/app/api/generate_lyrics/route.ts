import { NextRequest } from "next/server";
import { sunoApiFactory } from "@/lib/services";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { CreditsUsedEvent } from "@/lib/queue/events";
import { queue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  const body = await req.json();
  const { prompt } = body;
  const sunoApi = await sunoApiFactory.createBySunoSongId();
  const lyrics = await sunoApi.generateLyrics(prompt);

  queue.emit(new CreditsUsedEvent({
    sunoUserId: sunoApi.currentUserId,
  }));

  return okResponse(lyrics);
});

export { options as OPTIONS };