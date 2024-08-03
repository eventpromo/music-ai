import { NextRequest } from "next/server";
import { getCurrentSunoUser, sunoApiFactory } from "@/lib/services";
import { options, post, withRetry } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { CreditsUsedEvent } from "@/lib/queue/events";
import { queue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export const POST = withRetry(post(async (req: NextRequest) => {
  const body = await req.json();
  const { prompt } = body;

  const currentSunoUser = await getCurrentSunoUser();
  const sunoApi = await sunoApiFactory.createBySunoUser(currentSunoUser);
  const lyrics = await sunoApi.generateLyrics(prompt);

  queue.emit(new CreditsUsedEvent({
    sunoUserId: sunoApi.currentUserId,
  }));

  return okResponse(lyrics);
}), 2, 1000);

export { options as OPTIONS };