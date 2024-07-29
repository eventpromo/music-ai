import { NextRequest } from "next/server";
import { sunoApiFactory } from "@/lib/services";
import { options, post } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { CreditsUsedEvent } from "@/lib/queue/events";
import { queue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export const POST = post(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { prompt } = body;
    const sunoApi = await sunoApiFactory.create();
    const lyrics = await sunoApi.generateLyrics(prompt);

    queue.emit(new CreditsUsedEvent({
      sunoUserId: sunoApi.currentUserId,
    }));

    return okResponse(lyrics);
  } catch (error: any) {
    console.error('Error generating lyrics:', JSON.stringify(error.response.data));

    if (error.response.status === 402) {
      return errorResponse({ error: error.response.data.detail }, 402);
    }

    return errorResponse({ error: 'Internal server error: ' + JSON.stringify(error.response.data.detail) }, 500);
  }
});

export { options as OPTIONS };