import { getCurrentSunoUser, sunoApiFactory } from "@/lib/services";
import { DEFAULT_MODEL } from "@/lib/SunoApi";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { queue } from "@/lib/queue";
import { CreditsUsedEvent } from "@/lib/queue/events";

export const dynamic = "force-dynamic";

export const POST = post(async ({ body }) => {
  const { audio_id, prompt, continue_at, tags, title, model } = body;

  if (!audio_id) {
    return errorResponse({ error: 'Audio id is required' }, 400);
  }

  const currentSunoUser = await getCurrentSunoUser({ sunoSongId: audio_id });
  const sunoApi = await sunoApiFactory.createBySunoUser(currentSunoUser);
  const sunoSongInfo = await sunoApi.extendAudio(
    audio_id,
    prompt,
    continue_at,
    tags,
    title,
    model || DEFAULT_MODEL
  );

  queue.emit(new CreditsUsedEvent({
    sunoUserId: sunoApi.currentUserId,
  }));

  return okResponse(sunoSongInfo);
});

export { options as OPTIONS };