import { getCurrentSunoUser, sunoApiFactory } from "@/lib/services";
import { options, post } from "@/lib/http/requests";
import { okResponse } from "@/lib/http/responses";
import { CreditsUsedEvent } from "@/lib/queue/events";
import { queue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export const POST = post(async ({ body }) => {
  const { prompt } = body;

  const currentSunoUser = await getCurrentSunoUser();
  const sunoApi = await sunoApiFactory.createBySunoUser(currentSunoUser);
  const lyrics = await sunoApi.generateLyrics(prompt);

  queue.emit(new CreditsUsedEvent({
    sunoUserId: sunoApi.currentUserId,
  }));

  return okResponse(lyrics);
}, { retries: 3, delay: 1000 });

export { options as OPTIONS };