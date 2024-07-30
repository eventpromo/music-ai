import { options, get } from "@/lib/http/requests";
import { errorResponse, okResponse } from "@/lib/http/responses";
import { InvalidCookieError } from "@/lib/models/exceptions";
import { queue } from "@/lib/queue";
import { CookieInvalidatedEvent } from "@/lib/queue/events";
import { sunoApiFactory } from "@/lib/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const GET = get(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const sunoUserId = url.searchParams.get('userId');
    const sunoApi = await sunoApiFactory.createBySunoUserId(sunoUserId);
    const limit = await sunoApi.getCredits();

    return okResponse(limit);
  } catch (error) {
    if (error instanceof InvalidCookieError) {
      queue.emit(new CookieInvalidatedEvent({ sunoUserId: error.sunoUserId }));
      return errorResponse({ error: 'Invalid cookie. ' + error }, 401);
    }

    return errorResponse({ error: 'Internal server error. ' + error }, 500);
  }
});

export { options as OPTIONS };